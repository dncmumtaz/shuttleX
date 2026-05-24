package com.shuttlex.service.impl;

import com.shuttlex.config.JwtUtils;
import com.shuttlex.dto.request.LoginRequest;
import com.shuttlex.dto.request.RegisterRequest;
import com.shuttlex.dto.response.AuthResponse;
import com.shuttlex.enums.UserRole;
import com.shuttlex.exception.BadRequestException;
import com.shuttlex.exception.EmailAlreadyExistsException;
import com.shuttlex.model.DriverProfile;
import com.shuttlex.model.User;
import com.shuttlex.repository.UserRepository;
import com.shuttlex.service.AuthService;
import com.shuttlex.service.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;

    @Value("${jwt.prefix}")
    private String jwtPrefix;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        validateRegisterRequest(request);

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("error.email.already.exists");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .role(request.getRole())
                .enabled(true)
                .build();

        if (request.getRole() == UserRole.DRIVER) {
            DriverProfile driverProfile = DriverProfile.builder()
                    .plateNumber(request.getPlateNumber())
                    .vehicleModel(request.getVehicleModel())
                    .capacity(request.getCapacity())
                    .active(true)
                    .user(user)
                    .build();
            user.setDriverProfile(driverProfile);
        }

        User savedUser = userRepository.save(user);
        return buildAuthResponse(savedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userDetailsService.loadUserEntityByEmail(request.getEmail());
        return buildAuthResponse(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtils.generateToken(userDetails, user.getId(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .tokenType(jwtPrefix)
                .userId(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .build();
    }

    private void validateRegisterRequest(RegisterRequest request) {
        if (request.getRole() == UserRole.ADMIN) {
            throw new BadRequestException("error.register.admin.not.allowed");
        }

        if (request.getRole() == UserRole.DRIVER) {
            if (!StringUtils.hasText(request.getPlateNumber())) {
                throw new BadRequestException("error.register.driver.plate.required");
            }
            if (!StringUtils.hasText(request.getVehicleModel())) {
                throw new BadRequestException("error.register.driver.vehicle.required");
            }
            if (request.getCapacity() == null || request.getCapacity() < 1) {
                throw new BadRequestException("error.register.driver.capacity.required");
            }
        }
    }
}
