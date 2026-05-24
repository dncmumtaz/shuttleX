package com.shuttlex.service;

import com.shuttlex.dto.request.LoginRequest;
import com.shuttlex.dto.request.RegisterRequest;
import com.shuttlex.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}
