package com.bitehub.controller;

import com.bitehub.domain.entity.Booking;
import com.bitehub.domain.enums.BookingStatus;
import com.bitehub.domain.enums.PaymentStatus;
import com.bitehub.dto.booking.BookingResponse;
import com.bitehub.rule.BookingRule;
import com.bitehub.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping
    public ResponseEntity<?> getBookings(
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) String restaurantId,
            @RequestParam(required = false) BookingStatus bookingStatus,
            @RequestParam(required = false) PaymentStatus paymentStatus
    ) {
        return ResponseEntity.ok(bookingService.getBookingResponseList(bookingStatus, paymentStatus, userId, restaurantId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBooking(@PathVariable String id) {
        return ResponseEntity.ok(bookingService.getBookingResponseById(id));
    }

    @GetMapping("/{id}/cancellation-policy")
    public ResponseEntity<BookingRule.PolicyDecision> cancellationPolicy(@PathVariable String id) {
        return ResponseEntity.ok(bookingService.getCancellationPolicy(id));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(@PathVariable String id) {
        return ResponseEntity.ok(bookingService.cancelBookingResponseById(id));
    }

    @PostMapping("/auto-cancel")
    public ResponseEntity<Map<String, Integer>> autoCancel() {
        return ResponseEntity.ok(Map.of("updated", bookingService.autoCancelExpiredBookingRows()));
    }

    @PostMapping
    public ResponseEntity<BookingResponse> saveBooking(@RequestBody Booking booking) {
        return ResponseEntity.ok(bookingService.createOrReplaceBookingResponse(booking));
    }
}
