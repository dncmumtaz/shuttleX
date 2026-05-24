package com.shuttlex.service;

import com.shuttlex.dto.request.SendMessageRequest;
import com.shuttlex.dto.response.MessageResponse;

import java.util.List;

public interface MessageService {

    MessageResponse sendMessage(SendMessageRequest request);

    List<MessageResponse> getMessagesByBookingId(Long bookingId);
}
