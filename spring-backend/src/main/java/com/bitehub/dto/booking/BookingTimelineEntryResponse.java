package com.bitehub.dto.booking;

import java.time.Instant;

public record BookingTimelineEntryResponse(
        String eventType,
        String statusValue,
        Instant eventAt,
        String note
) {
}
