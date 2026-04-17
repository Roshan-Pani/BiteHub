package com.bitehub.service;

import com.bitehub.domain.entity.Booking;
import com.bitehub.domain.entity.Feedback;
import com.bitehub.dto.RestaurantFeedbackStatsResponse;
import com.bitehub.dto.feedback.FeedbackResponse;
import com.bitehub.mapper.FeedbackMapper;
import com.bitehub.repository.BookingRepository;
import com.bitehub.repository.FeedbackRepository;
import com.bitehub.rule.BookingRule;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final BookingRepository bookingRepository;
    private final FeedbackMapper feedbackMapper;

    public FeedbackService(FeedbackRepository feedbackRepository, BookingRepository bookingRepository, FeedbackMapper feedbackMapper) {
        this.feedbackRepository = feedbackRepository;
        this.bookingRepository = bookingRepository;
        this.feedbackMapper = feedbackMapper;
    }

    public List<Feedback> getFeedbackList(String bookingId, String userId, String restaurantId) {
        if (bookingId != null) {
            return feedbackRepository.findAll().stream().filter(item -> bookingId.equals(item.getBooking().getId())).toList();
        }
        if (userId != null) {
            return feedbackRepository.findByUser_Id(userId);
        }
        if (restaurantId != null) {
            return feedbackRepository.findByRestaurant_Id(restaurantId);
        }
        return feedbackRepository.findAll();
    }

    @Transactional
    public List<FeedbackResponse> getFeedbackResponseList(String bookingId, String userId, String restaurantId) {
        return getFeedbackList(bookingId, userId, restaurantId).stream().map(feedbackMapper::toDto).toList();
    }

    public BookingRule.PolicyDecision getFeedbackEligibility(String bookingId, String userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found."));
        boolean hasExistingFeedback = feedbackRepository.findByBooking_Id(bookingId).isPresent();
        return BookingRule.evaluateFeedbackGate(booking, userId, hasExistingFeedback);
    }

    @Transactional
    public Feedback submitFeedbackForBooking(Feedback feedback) {
        Booking booking = bookingRepository.findById(feedback.getBooking().getId())
                .orElseThrow(() -> new IllegalArgumentException("Booking not found."));
        boolean hasExistingFeedback = feedbackRepository.findByBooking_Id(booking.getId()).isPresent();
        BookingRule.PolicyDecision gate = BookingRule.evaluateFeedbackGate(booking, feedback.getUser().getId(), hasExistingFeedback);
        if (!gate.allowed()) {
            throw new IllegalArgumentException(gate.reason());
        }

        feedback.setBooking(booking);
        feedback.setSubmittedAt(Instant.now());
        feedback.setSource("runtime");
        Feedback savedFeedback = feedbackRepository.save(feedback);

        booking.setFeedbackSubmitted(true);
        booking.setFeedbackId(savedFeedback.getId());
        bookingRepository.save(booking);

        return savedFeedback;
    }

    @Transactional
    public FeedbackResponse submitFeedbackResponse(Feedback feedback) {
        Booking booking = bookingRepository.findById(feedback.getBooking().getId())
                .orElseThrow(() -> new IllegalArgumentException("Booking not found."));
        boolean hasExistingFeedback = feedbackRepository.findByBooking_Id(booking.getId()).isPresent();
        BookingRule.PolicyDecision gate = BookingRule.evaluateFeedbackGate(booking, feedback.getUser().getId(), hasExistingFeedback);
        if (!gate.allowed()) {
            throw new IllegalArgumentException(gate.reason());
        }

        feedback.setBooking(booking);
        feedback.setSubmittedAt(Instant.now());
        feedback.setSource("runtime");
        Feedback savedFeedback = feedbackRepository.save(feedback);

        booking.setFeedbackSubmitted(true);
        booking.setFeedbackId(savedFeedback.getId());
        bookingRepository.save(booking);

        return feedbackMapper.toDto(savedFeedback);
    }

    public Feedback upsertFeedbackRecord(Feedback feedback) {
        if (feedback.getId() == null || feedback.getId().isBlank()) {
            throw new IllegalArgumentException("Feedback id is required");
        }
        return feedbackRepository.save(feedback);
    }

    @Transactional
    public FeedbackResponse upsertFeedbackResponse(Feedback feedback) {
        if (feedback.getId() == null || feedback.getId().isBlank()) {
            throw new IllegalArgumentException("Feedback id is required");
        }
        return feedbackMapper.toDto(feedbackRepository.save(feedback));
    }

    @Transactional
    public RestaurantFeedbackStatsResponse buildRestaurantFeedbackStats(String restaurantId) {
        List<FeedbackResponse> allReviews = feedbackRepository.findByRestaurant_Id(restaurantId).stream()
                .sorted(Comparator.comparing(Feedback::getSubmittedAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                .map(feedbackMapper::toDto)
                .toList();

        double averageRating = allReviews.isEmpty()
                ? 0.0d
                : allReviews.stream().mapToInt(FeedbackResponse::rating).average().orElse(0.0d);

        return new RestaurantFeedbackStatsResponse(
                allReviews.size(),
                averageRating,
                allReviews,
                allReviews.stream().limit(6).toList()
        );
    }
}
