package com.shuttlex.service;

import com.shuttlex.exception.BadRequestException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

@Service
@Slf4j
public class FileStorageService {

    private static final long MAX_FILE_SIZE_BYTES = 5L * 1024 * 1024;
    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of("image/jpeg", "image/png");
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(".jpg", ".jpeg", ".png");
    private static final String PUBLIC_URL_PREFIX = "/uploads/vehicles/";

    private final Path vehicleImagesPath;

    public FileStorageService(@Value("${app.upload.vehicle-images-dir:uploads/vehicles}") String vehicleImagesDir) {
        this.vehicleImagesPath = Paths.get(vehicleImagesDir).toAbsolutePath().normalize();
    }

    public String storeVehicleImage(MultipartFile file) {
        validateVehicleImage(file);

        try {
            Files.createDirectories(vehicleImagesPath);
            String extension = resolveAllowedExtension(file);
            String storedFileName = UUID.randomUUID() + extension;
            Path targetLocation = vehicleImagesPath.resolve(storedFileName);

            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return PUBLIC_URL_PREFIX + storedFileName;
        } catch (IOException ex) {
            log.error("Failed to store vehicle image", ex);
            throw new BadRequestException("error.file.store.failed");
        }
    }

    public void deleteVehicleImageIfExists(String publicUrl) {
        if (!StringUtils.hasText(publicUrl) || !publicUrl.startsWith(PUBLIC_URL_PREFIX)) {
            return;
        }

        String fileName = publicUrl.substring(PUBLIC_URL_PREFIX.length());
        if (!StringUtils.hasText(fileName) || fileName.contains("..") || fileName.contains("/")) {
            log.warn("Skipping delete for unsafe vehicle image path: {}", publicUrl);
            return;
        }

        try {
            Files.deleteIfExists(vehicleImagesPath.resolve(fileName));
        } catch (IOException ex) {
            log.warn("Failed to delete vehicle image at {}", publicUrl, ex);
        }
    }

    public Path getVehicleImagesPath() {
        return vehicleImagesPath;
    }

    private void validateVehicleImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("error.file.empty");
        }

        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new BadRequestException("error.file.too.large");
        }

        String contentType = file.getContentType();
        if (!StringUtils.hasText(contentType) || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase(Locale.ROOT))) {
            throw new BadRequestException("error.file.invalid.type");
        }

        resolveAllowedExtension(file);
    }

    private String resolveAllowedExtension(MultipartFile file) {
        String originalFilename = file.getOriginalFilename();
        if (!StringUtils.hasText(originalFilename)) {
            throw new BadRequestException("error.file.invalid.type");
        }

        String extension = StringUtils.getFilenameExtension(originalFilename);
        if (!StringUtils.hasText(extension)) {
            throw new BadRequestException("error.file.invalid.type");
        }

        String normalizedExtension = "." + extension.toLowerCase(Locale.ROOT);
        if (!ALLOWED_EXTENSIONS.contains(normalizedExtension)) {
            throw new BadRequestException("error.file.invalid.type");
        }

        return normalizedExtension;
    }
}
