package com.shuttlex.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class AvailableDriverResponse {

    private Long driverProfileId;
    private Long driverUserId;
    private String driverFirstName;
    private String driverLastName;
    private String plateNumber;
    private String vehicleModel;
    private Integer capacity;
    private String vehicleImageUrl;
    private List<VehicleServiceResponse> services;
}
