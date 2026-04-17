package com.bitehub.dto;

import com.bitehub.dto.feedback.FeedbackResponse;

import java.util.List;

public record RestaurantFeedbackStatsResponse(
        long reviewCount,
        double averageRating,
        List<FeedbackResponse> allReviews,
        List<FeedbackResponse> recentReviews
) {
}
