package com.bitehub.dto.booking;

public record BookingGuestResponse(
        String id,
        String name,
        Integer age,
        String sex,
        String foodPreference,
        boolean infant
) {
}
