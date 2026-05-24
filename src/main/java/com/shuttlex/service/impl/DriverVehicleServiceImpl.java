package com.shuttlex.service.impl;

import com.shuttlex.dto.request.UpdateVehicleRequest;
import com.shuttlex.dto.response.DriverVehicleResponse;
import com.shuttlex.enums.UserRole;
import com.shuttlex.exception.ForbiddenException;
import com.shuttlex.exception.ResourceNotFoundException;
import com.shuttlex.model.DriverProfile;
import com.shuttlex.model.User;
import com.shuttlex.repository.DriverProfileRepository;
import com.shuttlex.repository.UserRepository;
import com.shuttlex.service.DriverVehicleService;
import com.shuttlex.service.FileStorageService;
import com.shuttlex.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class DriverVehicleServiceImpl implements DriverVehicleService {

    private final DriverProfileRepository driverProfileRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    @Override
    @Transactional(readOnly = true)
    public DriverVehicleResponse getMyVehicle() {
        DriverProfile driverProfile = getAuthenticatedDriverProfile();
        return toResponse(driverProfile);
    }

    @Override
    @Transactional
    public DriverVehicleResponse updateMyVehicle(UpdateVehicleRequest request, MultipartFile image) {
        DriverProfile driverProfile = getAuthenticatedDriverProfile();

        driverProfile.setPlateNumber(request.getPlateNumber().trim());
        driverProfile.setVehicleModel(request.getVehicleModel().trim());
        driverProfile.setCapacity(request.getCapacity());

        if (image != null && !image.isEmpty()) {
            String previousImageUrl = driverProfile.getVehicleImageUrl();
            String storedImageUrl = fileStorageService.storeVehicleImage(image);
            driverProfile.setVehicleImageUrl(storedImageUrl);
            fileStorageService.deleteVehicleImageIfExists(previousImageUrl);
        }

        DriverProfile savedProfile = driverProfileRepository.save(driverProfile);
        return toResponse(savedProfile);
    }

    private DriverProfile getAuthenticatedDriverProfile() {
        User user = userRepository.findByEmail(SecurityUtils.getCurrentUserEmail())
                .orElseThrow(() -> new ResourceNotFoundException("error.user.not.found"));

        if (user.getRole() != UserRole.DRIVER) {
            throw new ForbiddenException("error.driver.only");
        }

        return driverProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("error.driver.profile.not.found"));
    }

    private DriverVehicleResponse toResponse(DriverProfile driverProfile) {
        return DriverVehicleResponse.builder()
                .plateNumber(driverProfile.getPlateNumber())
                .vehicleModel(driverProfile.getVehicleModel())
                .capacity(driverProfile.getCapacity())
                .vehicleImageUrl(driverProfile.getVehicleImageUrl())
                .active(driverProfile.isActive())
                .build();
    }
}
