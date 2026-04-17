package com.bitehub.dto.feedback;

import java.time.Instant;

public record FeedbackResponse(
        String id,
        String bookingId,
        String userId,
        String restaurantId,
        int rating,
        String review,
        Integer serviceRating,
        Integer foodRating,
        Integer ambianceRating,
        Instant submittedAt,
        String source
) {
}
