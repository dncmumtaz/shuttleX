package com.shuttlex.repository;

import com.shuttlex.model.DriverProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DriverProfileRepository extends JpaRepository<DriverProfile, Long> {

    Optional<DriverProfile> findByUserId(Long userId);

    @Query("""
            SELECT dp FROM DriverProfile dp
            LEFT JOIN FETCH dp.vehicleServices
            WHERE dp.user.id = :userId
            """)
    Optional<DriverProfile> findByUserIdWithServices(@Param("userId") Long userId);

    @Query("""
            SELECT DISTINCT dp FROM DriverProfile dp
            JOIN FETCH dp.user u
            LEFT JOIN FETCH dp.vehicleServices
            WHERE dp.active = true
            AND u.enabled = true
            AND dp.capacity >= :passengerCount
            ORDER BY dp.capacity ASC
            """)
    List<DriverProfile> findAvailableActiveDrivers(@Param("passengerCount") Integer passengerCount);
}
