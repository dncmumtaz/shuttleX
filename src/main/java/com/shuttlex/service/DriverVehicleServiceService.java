package com.shuttlex.service;

import com.shuttlex.dto.request.UpdateVehicleServicesRequest;
import com.shuttlex.dto.response.DriverVehicleServicesResponse;
import com.shuttlex.dto.response.VehicleServiceResponse;

import java.util.List;

public interface DriverVehicleServiceService {

    DriverVehicleServicesResponse getMyVehicleServices();

    List<VehicleServiceResponse> updateMyVehicleServices(UpdateVehicleServicesRequest request);
}
