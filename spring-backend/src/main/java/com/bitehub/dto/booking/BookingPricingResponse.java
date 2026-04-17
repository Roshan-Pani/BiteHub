package com.bitehub.dto.booking;

import java.math.BigDecimal;

public record BookingPricingResponse(
        BigDecimal bookingBase,
        BigDecimal costPerSeat,
        Integer selectedSeatCount,
        BigDecimal subtotal,
        BigDecimal discount,
        BigDecimal total
) {
}
