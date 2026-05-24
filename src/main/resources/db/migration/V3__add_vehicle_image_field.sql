-- V3: Store vehicle image URL on driver profile (file served from /uploads/vehicles)

ALTER TABLE driver_profiles
    ADD COLUMN vehicle_image_url VARCHAR(512);
