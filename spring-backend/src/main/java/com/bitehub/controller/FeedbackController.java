package com.bitehub.controller;

import com.bitehub.domain.entity.Feedback;
import com.bitehub.rule.BookingRule;
import com.bitehub.dto.feedback.FeedbackResponse;
import com.bitehub.service.FeedbackService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @GetMapping
    public ResponseEntity<List<FeedbackResponse>> getFeedback(
            @RequestParam(required = false) String bookingId,
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) String restaurantId
    ) {
        return ResponseEntity.ok(feedbackService.getFeedbackResponseList(bookingId, userId, restaurantId));
    }

    @GetMapping("/eligibility/{bookingId}")
    public ResponseEntity<BookingRule.PolicyDecision> eligibility(
            @PathVariable String bookingId,
            @RequestParam String userId
    ) {
        return ResponseEntity.ok(feedbackService.getFeedbackEligibility(bookingId, userId));
    }

    @PostMapping("/submit")
    public ResponseEntity<FeedbackResponse> submitFeedback(@RequestBody Feedback feedback) {
        return ResponseEntity.ok(feedbackService.submitFeedbackResponse(feedback));
    }

    @PostMapping
    public ResponseEntity<FeedbackResponse> saveFeedback(@RequestBody Feedback feedback) {
        return ResponseEntity.ok(feedbackService.upsertFeedbackResponse(feedback));
    }
}
