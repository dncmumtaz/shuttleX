package com.shuttlex.service;

import com.shuttlex.dto.response.TripResponse;

import java.util.List;

public interface TripService {

    List<TripResponse> getMyTrips();
}
