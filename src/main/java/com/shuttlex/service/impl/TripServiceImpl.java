package com.shuttlex.service.impl;

import com.shuttlex.dto.response.TripResponse;
import com.shuttlex.enums.BookingStatus;
import com.shuttlex.enums.UserRole;
import com.shuttlex.exception.ForbiddenException;
import com.shuttlex.exception.ResourceNotFoundException;
import com.shuttlex.mapper.TripMapper;
import com.shuttlex.model.DriverProfile;
import com.shuttlex.model.User;
import com.shuttlex.repository.BookingRepository;
import com.shuttlex.repository.DriverProfileRepository;
import com.shuttlex.repository.TravelRequestRepository;
import com.shuttlex.repository.UserRepository;
import com.shuttlex.service.TripService;
import com.shuttlex.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TripServiceImpl implements TripService {

    private final UserRepository userRepository;
    private final TravelRequestRepository travelRequestRepository;
    private final DriverProfileRepository driverProfileRepository;
    private final BookingRepository bookingRepository;

    @Override
    @Transactional(readOnly = true)
    public List<TripResponse> getMyTrips() {
        User user = userRepository.findByEmail(SecurityUtils.getCurrentUserEmail())
                .orElseThrow(() -> new ResourceNotFoundException("error.user.not.found"));

        if (user.getRole() == UserRole.CUSTOMER) {
            return travelRequestRepository
                    .findByCustomerIdOrderByDepartureDateTimeDesc(user.getId())
                    .stream()
                    .map(TripMapper::fromTravelRequest)
                    .toList();
        }

        if (user.getRole() == UserRole.DRIVER) {
            DriverProfile driverProfile = driverProfileRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("error.driver.profile.not.found"));

            return bookingRepository
                    .findTripsByDriverProfileIdAndStatus(driverProfile.getId(), BookingStatus.CONFIRMED)
                    .stream()
                    .map(TripMapper::fromDriverBooking)
                    .toList();
        }

        throw new ForbiddenException("error.customer.or.driver.only");
    }
}
