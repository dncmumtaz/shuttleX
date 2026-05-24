package com.shuttlex.dto.response;

import com.shuttlex.enums.VehicleServiceCategory;
import com.shuttlex.enums.VehicleServiceCode;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class VehicleServiceResponse {

    private VehicleServiceCode code;
    private VehicleServiceCategory category;
    private BigDecimal price;
}
