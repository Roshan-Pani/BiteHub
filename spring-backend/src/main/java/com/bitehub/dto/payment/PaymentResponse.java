package com.bitehub.dto.payment;

import java.math.BigDecimal;
import java.time.Instant;

public record PaymentResponse(
        String id,
        String bookingId,
        String userId,
        String restaurantId,
        BigDecimal amount,
        String method,
        String status,
        Instant paidAt,
        String source
) {
}
