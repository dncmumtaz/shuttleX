package com.shuttlex.mapper;

import com.shuttlex.dto.response.MessageResponse;
import com.shuttlex.model.Message;
import com.shuttlex.util.PhoneNumberValidator;

public final class MessageMapper {

    private MessageMapper() {
    }

    public static MessageResponse toResponse(Message message, Long bookingId) {
        return MessageResponse.builder()
                .id(message.getId())
                .bookingId(bookingId)
                .travelRequestId(message.getTravelRequest().getId())
                .senderId(message.getSender().getId())
                .senderFirstName(message.getSender().getFirstName())
                .senderLastName(message.getSender().getLastName())
                .receiverId(message.getReceiver().getId())
                .receiverFirstName(message.getReceiver().getFirstName())
                .receiverLastName(message.getReceiver().getLastName())
                .content(PhoneNumberValidator.maskPhoneNumbers(message.getContent()))
                .read(message.isRead())
                .createdAt(message.getCreatedAt())
                .build();
    }
}
