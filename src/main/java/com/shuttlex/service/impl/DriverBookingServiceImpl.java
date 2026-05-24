package com.shuttlex.service.impl;

import com.shuttlex.dto.request.BookingRespondRequest;
import com.shuttlex.dto.response.BookingRespondResponse;
import com.shuttlex.dto.response.DriverBookingResponse;
import com.shuttlex.enums.BookingRespondAction;
import com.shuttlex.enums.BookingStatus;
import com.shuttlex.enums.RequestStatus;
import com.shuttlex.enums.UserRole;
import com.shuttlex.exception.BadRequestException;
import com.shuttlex.exception.ForbiddenException;
import com.shuttlex.exception.ResourceNotFoundException;
import com.shuttlex.mapper.BookingMapper;
import com.shuttlex.model.Booking;
import com.shuttlex.model.DriverProfile;
import com.shuttlex.model.TravelRequest;
import com.shuttlex.model.User;
import com.shuttlex.repository.BookingRepository;
import com.shuttlex.repository.DriverProfileRepository;
import com.shuttlex.repository.UserRepository;
import com.shuttlex.service.DriverBookingService;
import com.shuttlex.service.EmailService;
import com.shuttlex.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DriverBookingServiceImpl implements DriverBookingService {

    private final BookingRepository bookingRepository;
    private final DriverProfileRepository driverProfileRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Override
    @Transactional(readOnly = true)
    public List<DriverBookingResponse> getPendingRequests() {
        DriverProfile driverProfile = getAuthenticatedDriverProfile();

        return bookingRepository
                .findActiveDriverBookings(
                        driverProfile.getId(),
                        BookingStatus.PRE_MATCHED,
                        RequestStatus.PRE_MATCHED
                )
                .stream()
                .map(BookingMapper::toDriverBookingResponse)
                .toList();
    }

    @Override
    @Transactional
    public BookingRespondResponse respondToBooking(Long bookingId, BookingRespondRequest request) {
        DriverProfile driverProfile = getAuthenticatedDriverProfile();

        Booking booking = bookingRepository
                .findByIdAndDriverProfileId(bookingId, driverProfile.getId())
                .orElseThrow(() -> new ResourceNotFoundException("error.booking.not.found"));

        if (booking.getStatus() != BookingStatus.PRE_MATCHED) {
            throw new BadRequestException("error.booking.not.pre.matched");
        }

        TravelRequest travelRequest = booking.getTravelRequest();

        if (travelRequest.getStatus() != RequestStatus.PRE_MATCHED) {
            throw new BadRequestException("error.travel.request.not.respondable");
        }

        if (request.getAction() == BookingRespondAction.ACCEPT) {
            return acceptBooking(booking, travelRequest);
        }

        return rejectBooking(booking, travelRequest);
    }

    private BookingRespondResponse acceptBooking(Booking booking, TravelRequest travelRequest) {
        booking.setStatus(BookingStatus.CONFIRMED);
        travelRequest.setStatus(RequestStatus.ACCEPTED);

        bookingRepository.save(booking);

        User customer = travelRequest.getCustomer();
        emailService.sendNotification(
                customer.getEmail(),
                "ShuttleX - Yolculuk Talebiniz Onaylandı",
                String.format(
                        "Sayın %s %s, %s → %s rotasındaki yolculuk talebiniz şoför tarafından onaylandı.",
                        customer.getFirstName(),
                        customer.getLastName(),
                        travelRequest.getOrigin(),
                        travelRequest.getDestination()
                )
        );

        return BookingRespondResponse.builder()
                .bookingId(booking.getId())
                .bookingStatus(booking.getStatus())
                .travelRequestId(travelRequest.getId())
                .travelRequestStatus(travelRequest.getStatus())
                .message("Rezervasyon onaylandı, müşteriye bildirim gönderildi")
                .updatedAt(booking.getUpdatedAt())
                .build();
    }

    private BookingRespondResponse rejectBooking(Booking booking, TravelRequest travelRequest) {
        booking.setStatus(BookingStatus.REJECTED);
        travelRequest.setStatus(RequestStatus.PENDING);

        bookingRepository.save(booking);

        return BookingRespondResponse.builder()
                .bookingId(booking.getId())
                .bookingStatus(booking.getStatus())
                .travelRequestId(travelRequest.getId())
                .travelRequestStatus(travelRequest.getStatus())
                .message("Rezervasyon reddedildi, müşteri başka şoför seçebilir")
                .updatedAt(booking.getUpdatedAt())
                .build();
    }

    private DriverProfile getAuthenticatedDriverProfile() {
        User user = userRepository.findByEmail(SecurityUtils.getCurrentUserEmail())
                .orElseThrow(() -> new ResourceNotFoundException("error.user.not.found"));

        if (user.getRole() != UserRole.DRIVER) {
            throw new ForbiddenException("error.driver.only");
        }

        return driverProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("error.driver.profile.not.found"));
    }
}
