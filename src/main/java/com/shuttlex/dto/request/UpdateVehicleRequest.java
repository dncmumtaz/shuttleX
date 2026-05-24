package com.shuttlex.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateVehicleRequest {

    @NotBlank(message = "{validation.plateNumber.required}")
    @Size(max = 20, message = "{validation.plateNumber.size}")
    private String plateNumber;

    @NotBlank(message = "{validation.vehicleModel.required}")
    @Size(max = 255, message = "{validation.vehicleModel.size}")
    private String vehicleModel;

    @NotNull(message = "{validation.capacity.required}")
    @Min(value = 1, message = "{validation.capacity.min}")
    private Integer capacity;
}
