package com.shuttlex.repository;

import com.shuttlex.enums.RequestStatus;
import com.shuttlex.model.TravelRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TravelRequestRepository extends JpaRepository<TravelRequest, Long> {

    Optional<TravelRequest> findByIdAndCustomerId(Long id, Long customerId);

    boolean existsByIdAndCustomerIdAndStatus(Long id, Long customerId, RequestStatus status);

    @Query("""
            SELECT tr FROM TravelRequest tr
            LEFT JOIN FETCH tr.bookings b
            LEFT JOIN FETCH b.driverProfile dp
            LEFT JOIN FETCH dp.user du
            WHERE tr.customer.id = :customerId
            ORDER BY tr.departureDateTime DESC
            """)
    List<TravelRequest> findByCustomerIdOrderByDepartureDateTimeDesc(@Param("customerId") Long customerId);
}
