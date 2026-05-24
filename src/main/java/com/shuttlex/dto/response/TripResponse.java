package com.shuttlex.dto.response;

import com.shuttlex.enums.BookingStatus;
import com.shuttlex.enums.RequestStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class TripResponse {

    private Long travelRequestId;
    private Long bookingId;
    private RequestStatus travelRequestStatus;
    private BookingStatus bookingStatus;
    private String origin;
    private String destination;
    private LocalDateTime departureDateTime;
    private Integer passengerCount;
    private String notes;
    private Long counterpartId;
    private String counterpartFirstName;
    private String counterpartLastName;
    private String counterpartRole;
    private boolean active;
    private LocalDateTime createdAt;
}
