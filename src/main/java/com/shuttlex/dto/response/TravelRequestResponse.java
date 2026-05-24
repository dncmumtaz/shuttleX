package com.shuttlex.dto.response;

import com.shuttlex.enums.RequestStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class TravelRequestResponse {

    private Long id;
    private String origin;
    private String destination;
    private LocalDateTime departureDateTime;
    private Integer passengerCount;
    private RequestStatus status;
    private String notes;
    private LocalDateTime createdAt;
}
