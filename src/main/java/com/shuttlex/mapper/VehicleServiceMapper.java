package com.shuttlex.mapper;

import com.shuttlex.dto.response.VehicleServiceCatalogItemResponse;
import com.shuttlex.dto.response.VehicleServiceResponse;
import com.shuttlex.enums.VehicleServiceCode;
import com.shuttlex.model.DriverVehicleService;

import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

public final class VehicleServiceMapper {

    private VehicleServiceMapper() {
    }

    public static VehicleServiceResponse toResponse(DriverVehicleService service) {
        return VehicleServiceResponse.builder()
                .code(service.getServiceCode())
                .category(service.getServiceCode().getCategory())
                .price(service.getPrice())
                .build();
    }

    public static List<VehicleServiceResponse> toResponseList(List<DriverVehicleService> services) {
        return services.stream()
                .sorted(Comparator.comparing(s -> s.getServiceCode().name()))
                .map(VehicleServiceMapper::toResponse)
                .toList();
    }

    public static List<VehicleServiceCatalogItemResponse> toCatalog() {
        return Arrays.stream(VehicleServiceCode.values())
                .map(code -> VehicleServiceCatalogItemResponse.builder()
                        .code(code)
                        .category(code.getCategory())
                        .defaultPrice(code.getDefaultPrice())
                        .build())
                .toList();
    }
}
