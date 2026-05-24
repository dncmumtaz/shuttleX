package com.shuttlex.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class MessageResponse {

    private Long id;
    private Long bookingId;
    private Long travelRequestId;
    private Long senderId;
    private String senderFirstName;
    private String senderLastName;
    private Long receiverId;
    private String receiverFirstName;
    private String receiverLastName;
    private String content;
    private boolean read;
    private LocalDateTime createdAt;
}
