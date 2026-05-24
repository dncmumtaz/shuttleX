package com.shuttlex.dto.request;

import com.shuttlex.enums.VehicleServiceCode;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class VehicleServiceItemRequest {

    @NotNull(message = "{validation.vehicle.service.code.required}")
    private VehicleServiceCode serviceCode;

    @NotNull(message = "{validation.vehicle.service.price.required}")
    @DecimalMin(value = "0.0", message = "{validation.vehicle.service.price.min}")
    private BigDecimal price;
}
