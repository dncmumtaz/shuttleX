package com.shuttlex.controller;

import com.shuttlex.dto.response.TripResponse;
import com.shuttlex.service.TripService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/trips")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('CUSTOMER', 'DRIVER')")
public class TripController {

    private final TripService tripService;

    @GetMapping
    public ResponseEntity<List<TripResponse>> getMyTrips() {
        List<TripResponse> trips = tripService.getMyTrips();
        return ResponseEntity.ok(trips);
    }
}
