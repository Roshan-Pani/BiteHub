package com.bitehub.rule;

import com.bitehub.domain.entity.Booking;
import com.bitehub.domain.enums.BookingStatus;
import com.bitehub.domain.enums.PaymentStatus;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Locale;

public final class BookingRule {

    private static final Duration CANCELLATION_CUTOFF = Duration.ofHours(2);

    private BookingRule() {
    }

    public static LocalTime parseMeridianTime(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        String safeValue = value.trim().toUpperCase(Locale.ROOT);
        if (safeValue.contains(":" ) && !safeValue.contains("AM") && !safeValue.contains("PM")) {
            return LocalTime.parse(safeValue.length() == 5 ? safeValue + ":00" : safeValue);
        }

        String[] parts = safeValue.split(" ");
        if (parts.length != 2) {
            return null;
        }

        String[] clockParts = parts[0].split(":");
        if (clockParts.length < 2) {
            return null;
        }

        int hours = Integer.parseInt(clockParts[0]);
        int minutes = Integer.parseInt(clockParts[1]);
        String period = parts[1];

        if ("PM".equals(period) && hours != 12) {
            hours += 12;
        }
        if ("AM".equals(period) && hours == 12) {
            hours = 0;
        }

        return LocalTime.of(hours, minutes);
    }

    public static LocalDateTime toDateTime(String date, String time) {
        if (date == null || date.isBlank() || time == null || time.isBlank()) {
            return null;
        }

        LocalDate parsedDate = LocalDate.parse(date);
        LocalTime parsedTime = parseMeridianTime(time);
        if (parsedTime == null) {
            return null;
        }

        return LocalDateTime.of(parsedDate, parsedTime);
    }

    public static PaymentStatus normalizePaymentStatus(String status) {
        String safe = status == null ? "" : status.trim().toLowerCase(Locale.ROOT);
        if (safe.equals("completed") || safe.equals("paid") || safe.equals("success")) {
            return PaymentStatus.PAID;
        }
        if (safe.equals("pay at restaurant") || safe.equals("cash") || safe.equals("restaurant")) {
            return PaymentStatus.PAY_AT_RESTAURANT;
        }
        if (safe.equals("cancelled") || safe.equals("failed")) {
            return PaymentStatus.CANCELLED;
        }
        return PaymentStatus.PENDING;
    }

    public static PolicyDecision evaluateCancellationPolicy(Booking booking, Instant now, Duration cutoff) {
        if (booking == null) {
            return new PolicyDecision(false, "Booking not found.");
        }
        if (booking.getBookingStatus() != BookingStatus.UPCOMING) {
            return new PolicyDecision(false, "Only upcoming bookings can be cancelled.");
        }

        LocalDateTime dateTime = toDateTime(
                booking.getBookingDate() == null ? null : booking.getBookingDate().toString(),
                booking.getBookingTime() == null ? null : booking.getBookingTime().toString()
        );
        if (dateTime == null) {
            return new PolicyDecision(true, "");
        }

        Instant bookingInstant = dateTime.toInstant(ZoneOffset.UTC);
        Duration remaining = Duration.between(now, bookingInstant);
        if (remaining.compareTo(cutoff) < 0) {
            return new PolicyDecision(false, "Cancellation closes 2 hours before booking time.");
        }

        return new PolicyDecision(true, "");
    }

    public static PolicyDecision evaluateCancellationPolicy(Booking booking) {
        return evaluateCancellationPolicy(booking, Instant.now(), CANCELLATION_CUTOFF);
    }

    public static PolicyDecision evaluateFeedbackGate(Booking booking, String userId, boolean hasExistingFeedback) {
        if (booking == null) {
            return new PolicyDecision(false, "Booking not found.");
        }
        if (userId == null || booking.getUser() == null || !userId.equals(booking.getUser().getId())) {
            return new PolicyDecision(false, "You can submit feedback only for your own booking.");
        }
        if (booking.getBookingStatus() != BookingStatus.COMPLETED) {
            return new PolicyDecision(false, "Feedback is allowed only for completed bookings.");
        }
        if (hasExistingFeedback) {
            return new PolicyDecision(false, "Feedback already submitted for this booking.");
        }

        LocalDateTime dateTime = toDateTime(
                booking.getBookingDate() == null ? null : booking.getBookingDate().toString(),
                booking.getBookingTime() == null ? null : booking.getBookingTime().toString()
        );
        if (dateTime != null && dateTime.toInstant(ZoneOffset.UTC).isAfter(Instant.now())) {
            return new PolicyDecision(false, "Feedback is available after your dining time has passed.");
        }

        return new PolicyDecision(true, "");
    }

    public record PolicyDecision(boolean allowed, String reason) {
    }
}
