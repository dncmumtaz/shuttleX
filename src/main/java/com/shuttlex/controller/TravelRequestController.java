package com.shuttlex.controller;

import com.shuttlex.dto.request.CreateTravelRequestRequest;
import com.shuttlex.dto.request.SelectDriverRequest;
import com.shuttlex.dto.request.TravelRequestSearchRequest;
import com.shuttlex.dto.response.AvailableDriverResponse;
import com.shuttlex.dto.response.SelectDriverResponse;
import com.shuttlex.dto.response.TravelRequestResponse;
import com.shuttlex.service.TravelRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/travel-requests")
@RequiredArgsConstructor
@Validated
@PreAuthorize("hasRole('CUSTOMER')")
public class TravelRequestController {

    private final TravelRequestService travelRequestService;

    @PostMapping
    public ResponseEntity<TravelRequestResponse> createTravelRequest(
            @Valid @RequestBody CreateTravelRequestRequest request
    ) {
        TravelRequestResponse response = travelRequestService.createTravelRequest(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/search")
    public ResponseEntity<List<AvailableDriverResponse>> searchAvailableDrivers(
            @Valid @ModelAttribute TravelRequestSearchRequest request
    ) {
        List<AvailableDriverResponse> drivers = travelRequestService.searchAvailableDrivers(request);
        return ResponseEntity.ok(drivers);
    }

    @PostMapping("/{id}/select-driver")
    public ResponseEntity<SelectDriverResponse> selectDriver(
            @PathVariable Long id,
            @Valid @RequestBody SelectDriverRequest request
    ) {
        SelectDriverResponse response = travelRequestService.selectDriver(id, request);
        return ResponseEntity.ok(response);
    }
}
