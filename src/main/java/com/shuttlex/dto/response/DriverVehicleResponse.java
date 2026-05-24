package com.shuttlex.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DriverVehicleResponse {

    private String plateNumber;
    private String vehicleModel;
    private Integer capacity;
    private String vehicleImageUrl;
    private boolean active;
}
