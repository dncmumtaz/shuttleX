package com.shuttlex.mapper;

import com.shuttlex.dto.response.AvailableDriverResponse;
import com.shuttlex.dto.response.SelectDriverResponse;
import com.shuttlex.dto.response.TravelRequestResponse;
import com.shuttlex.mapper.VehicleServiceMapper;
import com.shuttlex.model.Booking;
import com.shuttlex.model.DriverProfile;
import com.shuttlex.model.TravelRequest;

public final class TravelRequestMapper {

    private TravelRequestMapper() {
    }

    public static TravelRequestResponse toResponse(TravelRequest travelRequest) {
        return TravelRequestResponse.builder()
                .id(travelRequest.getId())
                .origin(travelRequest.getOrigin())
                .destination(travelRequest.getDestination())
                .departureDateTime(travelRequest.getDepartureDateTime())
                .passengerCount(travelRequest.getPassengerCount())
                .status(travelRequest.getStatus())
                .notes(travelRequest.getNotes())
                .createdAt(travelRequest.getCreatedAt())
                .build();
    }

    public static AvailableDriverResponse toAvailableDriverResponse(DriverProfile driverProfile) {
        return AvailableDriverResponse.builder()
                .driverProfileId(driverProfile.getId())
                .driverUserId(driverProfile.getUser().getId())
                .driverFirstName(driverProfile.getUser().getFirstName())
                .driverLastName(driverProfile.getUser().getLastName())
                .plateNumber(driverProfile.getPlateNumber())
                .vehicleModel(driverProfile.getVehicleModel())
                .capacity(driverProfile.getCapacity())
                .vehicleImageUrl(driverProfile.getVehicleImageUrl())
                .services(VehicleServiceMapper.toResponseList(driverProfile.getVehicleServices()))
                .build();
    }

    public static SelectDriverResponse toSelectDriverResponse(TravelRequest travelRequest, Booking booking) {
        DriverProfile driverProfile = booking.getDriverProfile();
        return SelectDriverResponse.builder()
                .travelRequestId(travelRequest.getId())
                .travelRequestStatus(travelRequest.getStatus())
                .bookingId(booking.getId())
                .bookingStatus(booking.getStatus())
                .driverProfileId(driverProfile.getId())
                .driverFirstName(driverProfile.getUser().getFirstName())
                .driverLastName(driverProfile.getUser().getLastName())
                .createdAt(booking.getCreatedAt())
                .build();
    }
}
