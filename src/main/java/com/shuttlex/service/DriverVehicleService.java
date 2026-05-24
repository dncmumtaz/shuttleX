package com.shuttlex.service;

import com.shuttlex.dto.request.UpdateVehicleRequest;
import com.shuttlex.dto.response.DriverVehicleResponse;
import org.springframework.web.multipart.MultipartFile;

public interface DriverVehicleService {

    DriverVehicleResponse getMyVehicle();

    DriverVehicleResponse updateMyVehicle(UpdateVehicleRequest request, MultipartFile image);
}
