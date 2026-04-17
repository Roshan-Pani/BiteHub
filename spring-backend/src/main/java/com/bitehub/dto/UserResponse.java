package com.bitehub.dto;

public record UserResponse(
        String id,
        String name,
        String email,
        String phone,
        String address,
        String profileImage,
        boolean authenticated,
        String source
) {
}
