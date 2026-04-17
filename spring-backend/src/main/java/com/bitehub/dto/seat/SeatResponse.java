package com.bitehub.dto.seat;

public record SeatResponse(
        String id,
        String restaurantId,
        String seatCode,
        String type,
        String status
) {
}
