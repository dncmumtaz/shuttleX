package com.shuttlex.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class DriverVehicleServicesResponse {

    private List<VehicleServiceResponse> enabledServices;
    private List<VehicleServiceCatalogItemResponse> catalog;
}
