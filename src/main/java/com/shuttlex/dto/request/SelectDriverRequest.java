package com.shuttlex.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SelectDriverRequest {

    @NotNull(message = "{validation.driverProfileId.required}")
    private Long driverProfileId;
}
