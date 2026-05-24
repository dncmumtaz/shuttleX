-- ShuttleX initial schema
-- V1: Core tables for users, drivers, travel requests, bookings and messages

CREATE TABLE users (
    id              BIGSERIAL PRIMARY KEY,
    email           VARCHAR(255)  NOT NULL UNIQUE,
    password        VARCHAR(255)  NOT NULL,
    first_name      VARCHAR(255)  NOT NULL,
    last_name       VARCHAR(255)  NOT NULL,
    phone           VARCHAR(20),
    role            VARCHAR(20)   NOT NULL,
    enabled         BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE driver_profiles (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT        NOT NULL UNIQUE,
    plate_number    VARCHAR(20)   NOT NULL,
    vehicle_model   VARCHAR(255)  NOT NULL,
    capacity        INTEGER       NOT NULL,
    is_active       BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_driver_profile_user
        FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE travel_requests (
    id                   BIGSERIAL PRIMARY KEY,
    customer_id          BIGINT        NOT NULL,
    origin               VARCHAR(255)  NOT NULL,
    destination          VARCHAR(255)  NOT NULL,
    departure_date_time  TIMESTAMP     NOT NULL,
    passenger_count      INTEGER       NOT NULL,
    status               VARCHAR(20)   NOT NULL DEFAULT 'PENDING',
    notes                VARCHAR(500),
    created_at           TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at           TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_travel_request_customer
        FOREIGN KEY (customer_id) REFERENCES users (id)
);

CREATE TABLE bookings (
    id                 BIGSERIAL PRIMARY KEY,
    travel_request_id  BIGINT        NOT NULL,
    driver_profile_id  BIGINT        NOT NULL,
    status             VARCHAR(20)   NOT NULL DEFAULT 'PRE_MATCHED',
    created_at         TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at         TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_booking_travel_request
        FOREIGN KEY (travel_request_id) REFERENCES travel_requests (id),
    CONSTRAINT fk_booking_driver_profile
        FOREIGN KEY (driver_profile_id) REFERENCES driver_profiles (id),
    CONSTRAINT uk_booking_request_driver
        UNIQUE (travel_request_id, driver_profile_id)
);

CREATE TABLE messages (
    id                 BIGSERIAL PRIMARY KEY,
    travel_request_id  BIGINT        NOT NULL,
    sender_id          BIGINT        NOT NULL,
    receiver_id        BIGINT        NOT NULL,
    content            VARCHAR(1000) NOT NULL,
    read               BOOLEAN       NOT NULL DEFAULT FALSE,
    created_at         TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_message_travel_request
        FOREIGN KEY (travel_request_id) REFERENCES travel_requests (id),
    CONSTRAINT fk_message_sender
        FOREIGN KEY (sender_id) REFERENCES users (id),
    CONSTRAINT fk_message_receiver
        FOREIGN KEY (receiver_id) REFERENCES users (id)
);

CREATE INDEX idx_travel_requests_customer_id ON travel_requests (customer_id);
CREATE INDEX idx_travel_requests_status ON travel_requests (status);
CREATE INDEX idx_travel_requests_departure_date_time ON travel_requests (departure_date_time);

CREATE INDEX idx_bookings_travel_request_id ON bookings (travel_request_id);
CREATE INDEX idx_bookings_driver_profile_id ON bookings (driver_profile_id);
CREATE INDEX idx_bookings_status ON bookings (status);

CREATE INDEX idx_messages_travel_request_id ON messages (travel_request_id);
CREATE INDEX idx_messages_sender_id ON messages (sender_id);
CREATE INDEX idx_messages_receiver_id ON messages (receiver_id);

CREATE INDEX idx_driver_profiles_is_active ON driver_profiles (is_active);
