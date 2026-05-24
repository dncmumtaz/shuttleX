package com.shuttlex.enums;

import lombok.Getter;

import java.math.BigDecimal;

@Getter
public enum VehicleServiceCode {

    PAY_IN_VEHICLE(VehicleServiceCategory.FEATURE, BigDecimal.ZERO),
    FIXED_PRICE(VehicleServiceCategory.FEATURE, BigDecimal.ZERO),
    FLIGHT_TRACKING(VehicleServiceCategory.FEATURE, BigDecimal.ZERO),
    MEET_AND_GREET(VehicleServiceCategory.FEATURE, BigDecimal.ZERO),
    ENTERTAINMENT(VehicleServiceCategory.FEATURE, BigDecimal.ZERO),
    FREE_WIFI(VehicleServiceCategory.FEATURE, BigDecimal.ZERO),

    FREE_WATER(VehicleServiceCategory.AMENITY, BigDecimal.ZERO),
    TV_YOUTUBE(VehicleServiceCategory.AMENITY, BigDecimal.ZERO),
    IN_VEHICLE_REFRESHMENTS(VehicleServiceCategory.AMENITY, BigDecimal.ZERO),
    CLIMATE_COMFORT(VehicleServiceCategory.AMENITY, BigDecimal.ZERO),

    WATER(VehicleServiceCategory.EXTRA, BigDecimal.ZERO),
    BABY_SEAT(VehicleServiceCategory.EXTRA, BigDecimal.ZERO),
    BEER(VehicleServiceCategory.EXTRA, new BigDecimal("5")),
    SOFT_DRINK(VehicleServiceCategory.EXTRA, new BigDecimal("2")),
    ENERGY_DRINK(VehicleServiceCategory.EXTRA, new BigDecimal("3"));

    private final VehicleServiceCategory category;
    private final BigDecimal defaultPrice;

    VehicleServiceCode(VehicleServiceCategory category, BigDecimal defaultPrice) {
        this.category = category;
        this.defaultPrice = defaultPrice;
    }
}
