package com.shuttlex.service.impl;

import com.shuttlex.dto.request.UpdateVehicleServicesRequest;
import com.shuttlex.dto.request.VehicleServiceItemRequest;
import com.shuttlex.dto.response.DriverVehicleServicesResponse;
import com.shuttlex.dto.response.VehicleServiceResponse;
import com.shuttlex.enums.UserRole;
import com.shuttlex.exception.BadRequestException;
import com.shuttlex.exception.ForbiddenException;
import com.shuttlex.exception.ResourceNotFoundException;
import com.shuttlex.mapper.VehicleServiceMapper;
import com.shuttlex.model.DriverProfile;
import com.shuttlex.model.DriverVehicleService;
import com.shuttlex.model.User;
import com.shuttlex.repository.DriverProfileRepository;
import com.shuttlex.repository.UserRepository;
import com.shuttlex.service.DriverVehicleServiceService;
import com.shuttlex.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class DriverVehicleServiceServiceImpl implements DriverVehicleServiceService {

    private final DriverProfileRepository driverProfileRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public DriverVehicleServicesResponse getMyVehicleServices() {
        DriverProfile driverProfile = getAuthenticatedDriverProfileWithServices();

        return DriverVehicleServicesResponse.builder()
                .enabledServices(VehicleServiceMapper.toResponseList(driverProfile.getVehicleServices()))
                .catalog(VehicleServiceMapper.toCatalog())
                .build();
    }

    @Override
    @Transactional
    public List<VehicleServiceResponse> updateMyVehicleServices(UpdateVehicleServicesRequest request) {
        DriverProfile driverProfile = getAuthenticatedDriverProfileWithServices();
        validateUniqueServiceCodes(request.getServices());

        driverProfile.getVehicleServices().clear();

        List<DriverVehicleService> updatedServices = new ArrayList<>();
        for (VehicleServiceItemRequest item : request.getServices()) {
            updatedServices.add(DriverVehicleService.builder()
                    .driverProfile(driverProfile)
                    .serviceCode(item.getServiceCode())
                    .price(item.getPrice())
                    .build());
        }

        driverProfile.getVehicleServices().addAll(updatedServices);
        DriverProfile savedProfile = driverProfileRepository.save(driverProfile);

        return VehicleServiceMapper.toResponseList(savedProfile.getVehicleServices());
    }

    private void validateUniqueServiceCodes(List<VehicleServiceItemRequest> services) {
        Set<com.shuttlex.enums.VehicleServiceCode> seen = new HashSet<>();
        for (VehicleServiceItemRequest item : services) {
            if (!seen.add(item.getServiceCode())) {
                throw new BadRequestException("error.vehicle.service.duplicate");
            }
        }
    }

    private DriverProfile getAuthenticatedDriverProfileWithServices() {
        User user = userRepository.findByEmail(SecurityUtils.getCurrentUserEmail())
                .orElseThrow(() -> new ResourceNotFoundException("error.user.not.found"));

        if (user.getRole() != UserRole.DRIVER) {
            throw new ForbiddenException("error.driver.only");
        }

        return driverProfileRepository.findByUserIdWithServices(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("error.driver.profile.not.found"));
    }
}
