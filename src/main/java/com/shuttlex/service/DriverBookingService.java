package com.shuttlex.service;

import com.shuttlex.dto.request.BookingRespondRequest;
import com.shuttlex.dto.response.BookingRespondResponse;
import com.shuttlex.dto.response.DriverBookingResponse;

import java.util.List;

public interface DriverBookingService {

    List<DriverBookingResponse> getPendingRequests();

    BookingRespondResponse respondToBooking(Long bookingId, BookingRespondRequest request);
}
