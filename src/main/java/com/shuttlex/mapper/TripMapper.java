package com.shuttlex.mapper;

import com.shuttlex.dto.response.MessageResponse;
import com.shuttlex.dto.response.TripResponse;
import com.shuttlex.enums.BookingStatus;
import com.shuttlex.enums.RequestStatus;
import com.shuttlex.enums.UserRole;
import com.shuttlex.model.Booking;
import com.shuttlex.model.Message;
import com.shuttlex.model.TravelRequest;
import com.shuttlex.model.User;
import com.shuttlex.util.PhoneNumberValidator;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.Optional;

public final class TripMapper {

    private TripMapper() {
    }

    public static TripResponse fromTravelRequest(TravelRequest travelRequest) {
        Optional<Booking> confirmedBooking = travelRequest.getBookings().stream()
                .filter(b -> b.getStatus() == BookingStatus.CONFIRMED)
                .max(Comparator.comparing(Booking::getCreatedAt));

        User counterpart = confirmedBooking
                .map(b -> b.getDriverProfile().getUser())
                .orElse(null);

        return TripResponse.builder()
                .travelRequestId(travelRequest.getId())
                .bookingId(confirmedBooking.map(Booking::getId).orElse(null))
                .travelRequestStatus(travelRequest.getStatus())
                .bookingStatus(confirmedBooking.map(Booking::getStatus).orElse(null))
                .origin(travelRequest.getOrigin())
                .destination(travelRequest.getDestination())
                .departureDateTime(travelRequest.getDepartureDateTime())
                .passengerCount(travelRequest.getPassengerCount())
                .notes(travelRequest.getNotes())
                .counterpartId(counterpart != null ? counterpart.getId() : null)
                .counterpartFirstName(counterpart != null ? counterpart.getFirstName() : null)
                .counterpartLastName(counterpart != null ? counterpart.getLastName() : null)
                .counterpartRole(counterpart != null ? UserRole.DRIVER.name() : null)
                .active(isActiveTrip(travelRequest))
                .createdAt(travelRequest.getCreatedAt())
                .build();
    }

    public static TripResponse fromDriverBooking(Booking booking) {
        TravelRequest travelRequest = booking.getTravelRequest();
        User customer = travelRequest.getCustomer();

        return TripResponse.builder()
                .travelRequestId(travelRequest.getId())
                .bookingId(booking.getId())
                .travelRequestStatus(travelRequest.getStatus())
                .bookingStatus(booking.getStatus())
                .origin(travelRequest.getOrigin())
                .destination(travelRequest.getDestination())
                .departureDateTime(travelRequest.getDepartureDateTime())
                .passengerCount(travelRequest.getPassengerCount())
                .notes(travelRequest.getNotes())
                .counterpartId(customer.getId())
                .counterpartFirstName(customer.getFirstName())
                .counterpartLastName(customer.getLastName())
                .counterpartRole(UserRole.CUSTOMER.name())
                .active(isActiveTrip(travelRequest))
                .createdAt(booking.getCreatedAt())
                .build();
    }

    private static boolean isActiveTrip(TravelRequest travelRequest) {
        boolean statusActive = travelRequest.getStatus() == RequestStatus.ACCEPTED
                || travelRequest.getStatus() == RequestStatus.PRE_MATCHED
                || travelRequest.getStatus() == RequestStatus.PENDING;

        return statusActive && travelRequest.getDepartureDateTime().isAfter(LocalDateTime.now());
    }
}
