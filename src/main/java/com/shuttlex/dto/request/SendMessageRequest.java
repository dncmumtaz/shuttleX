package com.shuttlex.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SendMessageRequest {

    @NotNull(message = "{validation.bookingId.required}")
    private Long bookingId;

    @NotBlank(message = "{validation.message.content.required}")
    @Size(max = 1000, message = "{validation.message.content.size}")
    private String content;
}
