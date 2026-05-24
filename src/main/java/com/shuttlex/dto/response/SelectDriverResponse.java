package com.shuttlex.dto.response;

import com.shuttlex.enums.BookingStatus;
import com.shuttlex.enums.RequestStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class SelectDriverResponse {

    private Long travelRequestId;
    private RequestStatus travelRequestStatus;
    private Long bookingId;
    private BookingStatus bookingStatus;
    private Long driverProfileId;
    private String driverFirstName;
    private String driverLastName;
    private LocalDateTime createdAt;
}
