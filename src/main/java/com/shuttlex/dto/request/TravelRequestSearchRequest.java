package com.shuttlex.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class TravelRequestSearchRequest {

    @NotBlank(message = "{validation.origin.required}")
    private String origin;

    @NotBlank(message = "{validation.destination.required}")
    private String destination;

    @NotNull(message = "{validation.departureDateTime.required}")
    @Future(message = "{validation.departureDateTime.future}")
    private LocalDateTime departureDateTime;

    @NotNull(message = "{validation.passengerCount.required}")
    @Min(value = 1, message = "{validation.passengerCount.min}")
    private Integer passengerCount;
}
