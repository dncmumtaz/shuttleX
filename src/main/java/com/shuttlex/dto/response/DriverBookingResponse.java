package com.shuttlex.dto.response;

import com.shuttlex.enums.BookingStatus;
import com.shuttlex.enums.RequestStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class DriverBookingResponse {

    private Long bookingId;
    private BookingStatus bookingStatus;
    private Long travelRequestId;
    private RequestStatus travelRequestStatus;
    private String origin;
    private String destination;
    private LocalDateTime departureDateTime;
    private Integer passengerCount;
    private String notes;
    private Long customerId;
    private String customerFirstName;
    private String customerLastName;
    private String customerEmail;
    private LocalDateTime createdAt;
}
