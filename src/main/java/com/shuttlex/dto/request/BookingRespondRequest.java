package com.shuttlex.dto.request;

import com.shuttlex.enums.BookingRespondAction;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookingRespondRequest {

    @NotNull(message = "{validation.action.required}")
    private BookingRespondAction action;
}
