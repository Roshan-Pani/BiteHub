package com.bitehub.dto.booking;

import java.time.Instant;

public record BookingCancellationResponse(
        Instant attemptedAt,
        boolean allowed,
        String reason
) {
}
