package com.shuttlex.dto.response;

import com.shuttlex.enums.UserRole;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AuthResponse {

    private String token;
    private String tokenType;
    private Long userId;
    private String email;
    private String firstName;
    private String lastName;
    private UserRole role;
}
