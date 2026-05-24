package com.shuttlex.repository;

import com.shuttlex.enums.BookingStatus;
import com.shuttlex.enums.RequestStatus;
import com.shuttlex.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    boolean existsByTravelRequestIdAndStatus(Long travelRequestId, BookingStatus status);

    boolean existsByTravelRequestIdAndDriverProfileId(Long travelRequestId, Long driverProfileId);

    @Query("""
            SELECT b FROM Booking b
            JOIN FETCH b.travelRequest tr
            JOIN FETCH tr.customer c
            WHERE b.driverProfile.id = :driverProfileId
            AND b.status = :bookingStatus
            AND tr.status = :requestStatus
            ORDER BY b.createdAt DESC
            """)
    List<Booking> findActiveDriverBookings(
            @Param("driverProfileId") Long driverProfileId,
            @Param("bookingStatus") BookingStatus bookingStatus,
            @Param("requestStatus") RequestStatus requestStatus
    );

    @Query("""
            SELECT b FROM Booking b
            JOIN FETCH b.travelRequest tr
            JOIN FETCH tr.customer c
            WHERE b.id = :bookingId
            AND b.driverProfile.id = :driverProfileId
            """)
    Optional<Booking> findByIdAndDriverProfileId(
            @Param("bookingId") Long bookingId,
            @Param("driverProfileId") Long driverProfileId
    );

    @Query("""
            SELECT b FROM Booking b
            JOIN FETCH b.travelRequest tr
            JOIN FETCH tr.customer c
            JOIN FETCH b.driverProfile dp
            JOIN FETCH dp.user du
            WHERE b.id = :bookingId
            AND b.status = :bookingStatus
            """)
    Optional<Booking> findByIdAndStatus(
            @Param("bookingId") Long bookingId,
            @Param("bookingStatus") BookingStatus bookingStatus
    );

    @Query("""
            SELECT b FROM Booking b
            JOIN FETCH b.travelRequest tr
            JOIN FETCH tr.customer c
            JOIN FETCH b.driverProfile dp
            JOIN FETCH dp.user du
            WHERE dp.id = :driverProfileId
            AND b.status = :bookingStatus
            ORDER BY tr.departureDateTime DESC
            """)
    List<Booking> findTripsByDriverProfileIdAndStatus(
            @Param("driverProfileId") Long driverProfileId,
            @Param("bookingStatus") BookingStatus bookingStatus
    );
}
