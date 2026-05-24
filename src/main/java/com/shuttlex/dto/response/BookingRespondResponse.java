package com.shuttlex.dto.response;

import com.shuttlex.enums.BookingStatus;
import com.shuttlex.enums.RequestStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class BookingRespondResponse {

    private Long bookingId;
    private BookingStatus bookingStatus;
    private Long travelRequestId;
    private RequestStatus travelRequestStatus;
    private String message;
    private LocalDateTime updatedAt;
}
