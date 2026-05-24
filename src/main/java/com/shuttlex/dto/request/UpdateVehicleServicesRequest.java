package com.shuttlex.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UpdateVehicleServicesRequest {

    @NotNull(message = "{validation.vehicle.services.required}")
    @Valid
    private List<VehicleServiceItemRequest> services;
}
