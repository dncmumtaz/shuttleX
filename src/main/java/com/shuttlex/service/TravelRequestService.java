package com.shuttlex.service;

import com.shuttlex.dto.request.CreateTravelRequestRequest;
import com.shuttlex.dto.request.SelectDriverRequest;
import com.shuttlex.dto.request.TravelRequestSearchRequest;
import com.shuttlex.dto.response.AvailableDriverResponse;
import com.shuttlex.dto.response.SelectDriverResponse;
import com.shuttlex.dto.response.TravelRequestResponse;

import java.util.List;

public interface TravelRequestService {

    TravelRequestResponse createTravelRequest(CreateTravelRequestRequest request);

    List<AvailableDriverResponse> searchAvailableDrivers(TravelRequestSearchRequest request);

    SelectDriverResponse selectDriver(Long travelRequestId, SelectDriverRequest request);
}
