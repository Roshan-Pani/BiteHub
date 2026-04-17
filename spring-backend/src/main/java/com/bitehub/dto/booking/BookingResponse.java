package com.bitehub.dto.booking;

import com.bitehub.domain.enums.BookingStatus;
import com.bitehub.domain.enums.PaymentStatus;

import java.util.List;

public record BookingResponse(
        String id,
        String userId,
        String restaurantId,
        String restaurantName,
        String date,
        String time,
        List<BookingGuestResponse> guests,
        List<String> selectedTables,
        String specialRequests,
        String paymentMethod,
        PaymentStatus paymentStatus,
        BookingStatus bookingStatus,
        List<String> selectedSeatIds,
        List<String> seatNumbers,
        BookingPricingResponse pricing,
        BookingCancellationResponse cancellation,
        List<BookingTimelineEntryResponse> statusTimeline,
        boolean feedbackSubmitted,
        String feedbackId,
        Boolean attended,
        String source
) {
}
