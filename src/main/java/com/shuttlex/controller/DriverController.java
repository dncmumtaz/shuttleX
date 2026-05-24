package com.shuttlex.controller;

import com.shuttlex.dto.request.BookingRespondRequest;
import com.shuttlex.dto.request.UpdateVehicleRequest;
import com.shuttlex.dto.request.UpdateVehicleServicesRequest;
import com.shuttlex.dto.response.BookingRespondResponse;
import com.shuttlex.dto.response.DriverBookingResponse;
import com.shuttlex.dto.response.DriverVehicleResponse;
import com.shuttlex.dto.response.DriverVehicleServicesResponse;
import com.shuttlex.dto.response.VehicleServiceResponse;
import com.shuttlex.service.DriverBookingService;
import com.shuttlex.service.DriverVehicleService;
import com.shuttlex.service.DriverVehicleServiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/driver")
@RequiredArgsConstructor
@PreAuthorize("hasRole('DRIVER')")
public class DriverController {

    private final DriverBookingService driverBookingService;
    private final DriverVehicleServiceService driverVehicleServiceService;
    private final DriverVehicleService driverVehicleService;

    @GetMapping("/vehicle")
    public ResponseEntity<DriverVehicleResponse> getVehicle() {
        return ResponseEntity.ok(driverVehicleService.getMyVehicle());
    }

    @PutMapping(value = "/vehicle", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DriverVehicleResponse> updateVehicle(
            @Valid @ModelAttribute UpdateVehicleRequest request,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) {
        return ResponseEntity.ok(driverVehicleService.updateMyVehicle(request, image));
    }

    @GetMapping("/vehicle-services")
    public ResponseEntity<DriverVehicleServicesResponse> getVehicleServices() {
        return ResponseEntity.ok(driverVehicleServiceService.getMyVehicleServices());
    }

    @PutMapping("/vehicle-services")
    public ResponseEntity<List<VehicleServiceResponse>> updateVehicleServices(
            @Valid @RequestBody UpdateVehicleServicesRequest request
    ) {
        return ResponseEntity.ok(driverVehicleServiceService.updateMyVehicleServices(request));
    }

    @GetMapping("/requests")
    public ResponseEntity<List<DriverBookingResponse>> getPendingRequests() {
        List<DriverBookingResponse> requests = driverBookingService.getPendingRequests();
        return ResponseEntity.ok(requests);
    }

    @PostMapping("/bookings/{id}/respond")
    public ResponseEntity<BookingRespondResponse> respondToBooking(
            @PathVariable Long id,
            @Valid @RequestBody BookingRespondRequest request
    ) {
        BookingRespondResponse response = driverBookingService.respondToBooking(id, request);
        return ResponseEntity.ok(response);
    }
}
