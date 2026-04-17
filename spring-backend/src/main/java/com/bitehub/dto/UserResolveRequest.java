package com.bitehub.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UserResolveRequest(
        @NotBlank @Email String email,
        String name,
        String phone,
        String address,
        String profileImage,
        Boolean authenticated
) {
}
