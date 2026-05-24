package com.shuttlex.model;

import com.shuttlex.enums.VehicleServiceCode;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "driver_vehicle_services",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_driver_vehicle_service",
                columnNames = {"driver_profile_id", "service_code"}
        )
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriverVehicleService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "driver_profile_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_vehicle_service_driver"))
    @ToString.Exclude
    private DriverProfile driverProfile;

    @Enumerated(EnumType.STRING)
    @Column(name = "service_code", nullable = false, length = 40)
    private VehicleServiceCode serviceCode;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
