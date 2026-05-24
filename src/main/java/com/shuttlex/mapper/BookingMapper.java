package com.shuttlex.mapper;

import com.shuttlex.dto.response.DriverBookingResponse;
import com.shuttlex.model.Booking;

public final class BookingMapper {

    private BookingMapper() {
    }

    public static DriverBookingResponse toDriverBookingResponse(Booking booking) {
        return DriverBookingResponse.builder()
                .bookingId(booking.getId())
                .bookingStatus(booking.getStatus())
                .travelRequestId(booking.getTravelRequest().getId())
                .travelRequestStatus(booking.getTravelRequest().getStatus())
                .origin(booking.getTravelRequest().getOrigin())
                .destination(booking.getTravelRequest().getDestination())
                .departureDateTime(booking.getTravelRequest().getDepartureDateTime())
                .passengerCount(booking.getTravelRequest().getPassengerCount())
                .notes(booking.getTravelRequest().getNotes())
                .customerId(booking.getTravelRequest().getCustomer().getId())
                .customerFirstName(booking.getTravelRequest().getCustomer().getFirstName())
                .customerLastName(booking.getTravelRequest().getCustomer().getLastName())
                .customerEmail(booking.getTravelRequest().getCustomer().getEmail())
                .createdAt(booking.getCreatedAt())
                .build();
    }
}
