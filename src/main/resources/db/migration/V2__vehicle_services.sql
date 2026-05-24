-- Vehicle services offered by drivers

CREATE TABLE driver_vehicle_services (
    id                  BIGSERIAL PRIMARY KEY,
    driver_profile_id   BIGINT          NOT NULL,
    service_code        VARCHAR(40)     NOT NULL,
    price               NUMERIC(10, 2)  NOT NULL DEFAULT 0,
    created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_vehicle_service_driver
        FOREIGN KEY (driver_profile_id) REFERENCES driver_profiles (id) ON DELETE CASCADE,
    CONSTRAINT uk_driver_vehicle_service
        UNIQUE (driver_profile_id, service_code)
);

CREATE INDEX idx_driver_vehicle_services_profile_id ON driver_vehicle_services (driver_profile_id);
