package com.shuttlex.service.impl;

import com.shuttlex.dto.request.CreateTravelRequestRequest;
import com.shuttlex.dto.request.SelectDriverRequest;
import com.shuttlex.dto.request.TravelRequestSearchRequest;
import com.shuttlex.dto.response.AvailableDriverResponse;
import com.shuttlex.dto.response.SelectDriverResponse;
import com.shuttlex.dto.response.TravelRequestResponse;
import com.shuttlex.enums.BookingStatus;
import com.shuttlex.enums.RequestStatus;
import com.shuttlex.enums.UserRole;
import com.shuttlex.exception.BadRequestException;
import com.shuttlex.exception.ForbiddenException;
import com.shuttlex.exception.ResourceNotFoundException;
import com.shuttlex.mapper.TravelRequestMapper;
import com.shuttlex.model.Booking;
import com.shuttlex.model.DriverProfile;
import com.shuttlex.model.TravelRequest;
import com.shuttlex.model.User;
import com.shuttlex.repository.BookingRepository;
import com.shuttlex.repository.DriverProfileRepository;
import com.shuttlex.repository.TravelRequestRepository;
import com.shuttlex.repository.UserRepository;
import com.shuttlex.service.TravelRequestService;
import com.shuttlex.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TravelRequestServiceImpl implements TravelRequestService {

    private final TravelRequestRepository travelRequestRepository;
    private final DriverProfileRepository driverProfileRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public TravelRequestResponse createTravelRequest(CreateTravelRequestRequest request) {
        User customer = getAuthenticatedCustomer();

        TravelRequest travelRequest = TravelRequest.builder()
                .customer(customer)
                .origin(request.getOrigin())
                .destination(request.getDestination())
                .departureDateTime(request.getDepartureDateTime())
                .passengerCount(request.getPassengerCount())
                .notes(request.getNotes())
                .status(RequestStatus.PENDING)
                .build();

        TravelRequest savedRequest = travelRequestRepository.save(travelRequest);
        return TravelRequestMapper.toResponse(savedRequest);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AvailableDriverResponse> searchAvailableDrivers(TravelRequestSearchRequest request) {
        getAuthenticatedCustomer();

        return driverProfileRepository.findAvailableActiveDrivers(request.getPassengerCount())
                .stream()
                .map(TravelRequestMapper::toAvailableDriverResponse)
                .toList();
    }

    @Override
    @Transactional
    public SelectDriverResponse selectDriver(Long travelRequestId, SelectDriverRequest request) {
        User customer = getAuthenticatedCustomer();

        TravelRequest travelRequest = travelRequestRepository
                .findByIdAndCustomerId(travelRequestId, customer.getId())
                .orElseThrow(() -> new ResourceNotFoundException("error.travel.request.not.found"));

        if (travelRequest.getStatus() != RequestStatus.PENDING) {
            throw new BadRequestException("error.travel.request.not.pending");
        }

        if (bookingRepository.existsByTravelRequestIdAndStatus(travelRequestId, BookingStatus.PRE_MATCHED)) {
            throw new BadRequestException("error.travel.request.driver.already.selected");
        }

        DriverProfile driverProfile = driverProfileRepository.findById(request.getDriverProfileId())
                .orElseThrow(() -> new ResourceNotFoundException("error.driver.profile.not.found"));

        validateSelectedDriver(driverProfile, travelRequest);

        if (bookingRepository.existsByTravelRequestIdAndDriverProfileId(
                travelRequestId, driverProfile.getId())) {
            throw new BadRequestException("error.travel.request.driver.already.chosen");
        }

        travelRequest.setStatus(RequestStatus.PRE_MATCHED);

        Booking booking = Booking.builder()
                .travelRequest(travelRequest)
                .driverProfile(driverProfile)
                .status(BookingStatus.PRE_MATCHED)
                .build();

        travelRequest.getBookings().add(booking);
        travelRequestRepository.saveAndFlush(travelRequest);

        return TravelRequestMapper.toSelectDriverResponse(travelRequest, booking);
    }

    private void validateSelectedDriver(DriverProfile driverProfile, TravelRequest travelRequest) {
        if (!driverProfile.isActive()) {
            throw new BadRequestException("error.driver.not.active");
        }

        if (!driverProfile.getUser().isEnabled()) {
            throw new BadRequestException("error.driver.account.disabled");
        }

        if (driverProfile.getCapacity() < travelRequest.getPassengerCount()) {
            throw new BadRequestException("error.driver.capacity.insufficient");
        }
    }

    private User getAuthenticatedCustomer() {
        User user = userRepository.findByEmail(SecurityUtils.getCurrentUserEmail())
                .orElseThrow(() -> new ResourceNotFoundException("error.user.not.found"));

        if (user.getRole() != UserRole.CUSTOMER) {
            throw new ForbiddenException("error.customer.only");
        }

        return user;
    }
}
