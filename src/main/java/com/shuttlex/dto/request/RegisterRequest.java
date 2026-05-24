package com.shuttlex.dto.request;

import com.shuttlex.enums.UserRole;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    @NotBlank(message = "{validation.email.required}")
    @Email(message = "{validation.email.invalid}")
    private String email;

    @NotBlank(message = "{validation.password.required}")
    @Size(min = 6, message = "{validation.password.size}")
    private String password;

    @NotBlank(message = "{validation.firstName.required}")
    private String firstName;

    @NotBlank(message = "{validation.lastName.required}")
    private String lastName;

    @Size(max = 20, message = "{validation.phone.size}")
    private String phone;

    @NotNull(message = "{validation.role.required}")
    private UserRole role;

    private String plateNumber;
    private String vehicleModel;

    @Min(value = 1, message = "{validation.capacity.min}")
    private Integer capacity;
}
