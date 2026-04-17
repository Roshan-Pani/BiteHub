package com.bitehub.rule;

import com.bitehub.domain.entity.Booking;
import com.bitehub.domain.entity.Restaurant;
import com.bitehub.domain.entity.User;
import com.bitehub.domain.enums.BookingStatus;
import com.bitehub.domain.enums.PaymentStatus;
import org.junit.jupiter.api.Test;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;

import static org.assertj.core.api.Assertions.assertThat;

class BookingRuleTest {

    @Test
    void normalizePaymentStatusMapsKnownValues() {
        assertThat(BookingRule.normalizePaymentStatus("paid")).isEqualTo(PaymentStatus.PAID);
        assertThat(BookingRule.normalizePaymentStatus("cash")).isEqualTo(PaymentStatus.PAY_AT_RESTAURANT);
        assertThat(BookingRule.normalizePaymentStatus("failed")).isEqualTo(PaymentStatus.CANCELLED);
        assertThat(BookingRule.normalizePaymentStatus(null)).isEqualTo(PaymentStatus.PENDING);
    }

    @Test
    void parseMeridianTimeSupportsMeridianAndTwentyFourHourFormats() {
        assertThat(BookingRule.parseMeridianTime("10:30 PM")).isEqualTo(LocalTime.of(22, 30));
        assertThat(BookingRule.parseMeridianTime("07:15")).isEqualTo(LocalTime.of(7, 15));
    }

    @Test
    void cancellationPolicyBlocksWhenInsideCutoffWindow() {
        Booking booking = new Booking();
        booking.setBookingStatus(BookingStatus.UPCOMING);
        booking.setBookingDate(LocalDate.of(2026, 4, 17));
        booking.setBookingTime(LocalTime.of(20, 0));

        BookingRule.PolicyDecision decision = BookingRule.evaluateCancellationPolicy(
                booking,
                Instant.parse("2026-04-17T18:15:00Z"),
                Duration.ofHours(2)
        );

        assertThat(decision.allowed()).isFalse();
        assertThat(decision.reason()).isNotBlank();
    }

    @Test
    void feedbackGateAllowsCompletedPastBookingForOwnerWithoutExistingFeedback() {
        User user = new User();
        user.setId("U1");

        Restaurant restaurant = new Restaurant();
        restaurant.setId("R1");

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setRestaurant(restaurant);
        booking.setBookingStatus(BookingStatus.COMPLETED);
        booking.setBookingDate(LocalDate.of(2026, 4, 16));
        booking.setBookingTime(LocalTime.of(20, 0));

        BookingRule.PolicyDecision decision = BookingRule.evaluateFeedbackGate(booking, "U1", false);

        assertThat(decision.allowed()).isTrue();
        assertThat(decision.reason()).isEmpty();
    }
}
