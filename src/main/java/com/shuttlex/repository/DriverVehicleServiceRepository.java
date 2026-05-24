package com.shuttlex.repository;

import com.shuttlex.model.DriverVehicleService;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DriverVehicleServiceRepository extends JpaRepository<DriverVehicleService, Long> {

    List<DriverVehicleService> findByDriverProfileId(Long driverProfileId);

    void deleteByDriverProfileId(Long driverProfileId);
}
