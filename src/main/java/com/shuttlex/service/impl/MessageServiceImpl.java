package com.shuttlex.service.impl;

import com.shuttlex.dto.request.SendMessageRequest;
import com.shuttlex.dto.response.MessageResponse;
import com.shuttlex.enums.BookingStatus;
import com.shuttlex.exception.BadRequestException;
import com.shuttlex.exception.ForbiddenException;
import com.shuttlex.exception.ResourceNotFoundException;
import com.shuttlex.mapper.MessageMapper;
import com.shuttlex.model.Booking;
import com.shuttlex.model.Message;
import com.shuttlex.model.User;
import com.shuttlex.repository.BookingRepository;
import com.shuttlex.repository.MessageRepository;
import com.shuttlex.repository.UserRepository;
import com.shuttlex.service.MessageService;
import com.shuttlex.util.PhoneNumberValidator;
import com.shuttlex.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public MessageResponse sendMessage(SendMessageRequest request) {
        if (PhoneNumberValidator.containsPhoneNumber(request.getContent())) {
            throw new BadRequestException("error.message.phone.not.allowed");
        }

        User sender = userRepository.findByEmail(SecurityUtils.getCurrentUserEmail())
                .orElseThrow(() -> new ResourceNotFoundException("error.user.not.found"));

        Booking booking = bookingRepository
                .findByIdAndStatus(request.getBookingId(), BookingStatus.CONFIRMED)
                .orElseThrow(() -> new ResourceNotFoundException("error.booking.confirmed.not.found"));

        User receiver = resolveReceiver(sender, booking);

        Message message = Message.builder()
                .travelRequest(booking.getTravelRequest())
                .sender(sender)
                .receiver(receiver)
                .content(request.getContent())
                .read(false)
                .build();

        Message savedMessage = messageRepository.save(message);
        return MessageMapper.toResponse(savedMessage, booking.getId());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MessageResponse> getMessagesByBookingId(Long bookingId) {
        User currentUser = userRepository.findByEmail(SecurityUtils.getCurrentUserEmail())
                .orElseThrow(() -> new ResourceNotFoundException("error.user.not.found"));

        Booking booking = bookingRepository
                .findByIdAndStatus(bookingId, BookingStatus.CONFIRMED)
                .orElseThrow(() -> new ResourceNotFoundException("error.booking.confirmed.not.found"));

        validateParticipant(currentUser, booking);

        return messageRepository
                .findByTravelRequestIdOrderByCreatedAtAsc(booking.getTravelRequest().getId())
                .stream()
                .map(message -> MessageMapper.toResponse(message, bookingId))
                .toList();
    }

    private User resolveReceiver(User sender, Booking booking) {
        User customer = booking.getTravelRequest().getCustomer();
        User driver = booking.getDriverProfile().getUser();

        if (sender.getId().equals(customer.getId())) {
            return driver;
        }

        if (sender.getId().equals(driver.getId())) {
            return customer;
        }

        throw new ForbiddenException("error.message.send.forbidden");
    }

    private void validateParticipant(User currentUser, Booking booking) {
        Long customerId = booking.getTravelRequest().getCustomer().getId();
        Long driverUserId = booking.getDriverProfile().getUser().getId();

        if (!currentUser.getId().equals(customerId) && !currentUser.getId().equals(driverUserId)) {
            throw new ForbiddenException("error.message.view.forbidden");
        }
    }
}
