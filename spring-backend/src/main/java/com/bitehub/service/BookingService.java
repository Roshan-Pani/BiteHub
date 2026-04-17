package com.bitehub.service;

import com.bitehub.domain.entity.Booking;
import com.bitehub.domain.entity.BookingCancellation;
import com.bitehub.domain.entity.BookingTimelineEntry;
import com.bitehub.domain.enums.BookingStatus;
import com.bitehub.domain.enums.PaymentStatus;
import com.bitehub.dto.booking.BookingResponse;
import com.bitehub.mapper.BookingMapper;
import com.bitehub.repository.BookingRepository;
import com.bitehub.rule.BookingRule;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final BookingMapper bookingMapper;

    public BookingService(BookingRepository bookingRepository, BookingMapper bookingMapper) {
        this.bookingRepository = bookingRepository;
        this.bookingMapper = bookingMapper;
    }

    public List<Booking> getBookingList(BookingStatus bookingStatus, PaymentStatus paymentStatus, String userId, String restaurantId) {
        if (userId != null && bookingStatus != null) {
            return bookingRepository.findByUser_IdAndBookingStatusOrderByBookingDateDesc(userId, bookingStatus);
        }
        if (userId != null) {
            return bookingRepository.findByUser_IdOrderByBookingDateDesc(userId);
        }
        if (restaurantId != null) {
            return bookingRepository.findByRestaurant_IdOrderByBookingDateDesc(restaurantId);
        }
        if (bookingStatus != null) {
            return bookingRepository.findByBookingStatus(bookingStatus);
        }
        if (paymentStatus != null) {
            return bookingRepository.findByPaymentStatus(paymentStatus);
        }
        return bookingRepository.findAll();
    }

    public Booking getBookingById(String id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found."));
    }

    @Transactional
    public List<BookingResponse> getBookingResponseList(BookingStatus bookingStatus, PaymentStatus paymentStatus, String userId, String restaurantId) {
        return getBookingList(bookingStatus, paymentStatus, userId, restaurantId).stream().map(bookingMapper::toDto).toList();
    }

    @Transactional
    public BookingResponse getBookingResponseById(String id) {
        return bookingMapper.toDto(getBookingById(id));
    }

    public BookingRule.PolicyDecision getCancellationPolicy(String bookingId) {
        return BookingRule.evaluateCancellationPolicy(getBookingById(bookingId));
    }

    @Transactional
    public Booking cancelBookingById(String bookingId) {
        Booking booking = getBookingById(bookingId);
        BookingRule.PolicyDecision policy = BookingRule.evaluateCancellationPolicy(booking);
        if (!policy.allowed()) {
            throw new IllegalArgumentException(policy.reason());
        }

        booking.setBookingStatus(BookingStatus.CANCELLED);
        booking.setPaymentStatus(BookingRule.normalizePaymentStatus("cancelled"));
        booking.setFeedbackSubmitted(false);

        BookingCancellation cancellation = booking.getCancellation();
        if (cancellation == null) {
            cancellation = new BookingCancellation();
            cancellation.setBooking(booking);
            booking.setCancellation(cancellation);
        }
        cancellation.setAttemptedAt(Instant.now());
        cancellation.setAllowed(true);
        cancellation.setReason("Cancelled by user from My Bookings.");

        BookingTimelineEntry entry = new BookingTimelineEntry();
        entry.setBooking(booking);
        entry.setEventType("CANCELLED");
        entry.setStatusValue(BookingStatus.CANCELLED.name());
        entry.setEventAt(Instant.now());
        entry.setNote("Cancelled by user from My Bookings.");
        booking.getStatusTimeline().add(entry);

        return bookingRepository.save(booking);
    }

    @Transactional
    public BookingResponse cancelBookingResponseById(String bookingId) {
        Booking booking = getBookingById(bookingId);
        BookingRule.PolicyDecision policy = BookingRule.evaluateCancellationPolicy(booking);
        if (!policy.allowed()) {
            throw new IllegalArgumentException(policy.reason());
        }

        booking.setBookingStatus(BookingStatus.CANCELLED);
        booking.setPaymentStatus(BookingRule.normalizePaymentStatus("cancelled"));
        booking.setFeedbackSubmitted(false);

        BookingCancellation cancellation = booking.getCancellation();
        if (cancellation == null) {
            cancellation = new BookingCancellation();
            cancellation.setBooking(booking);
            booking.setCancellation(cancellation);
        }
        cancellation.setAttemptedAt(Instant.now());
        cancellation.setAllowed(true);
        cancellation.setReason("Cancelled by user from My Bookings.");

        BookingTimelineEntry entry = new BookingTimelineEntry();
        entry.setBooking(booking);
        entry.setEventType("CANCELLED");
        entry.setStatusValue(BookingStatus.CANCELLED.name());
        entry.setEventAt(Instant.now());
        entry.setNote("Cancelled by user from My Bookings.");
        booking.getStatusTimeline().add(entry);

        return bookingMapper.toDto(bookingRepository.save(booking));
    }

    @Transactional
    public int autoCancelExpiredBookingRows() {
        Instant now = Instant.now();
        List<Booking> upcomingBookings = bookingRepository.findByBookingStatus(BookingStatus.UPCOMING);
        int updated = 0;

        for (Booking booking : upcomingBookings) {
            if (booking.getBookingDate() == null || booking.getBookingTime() == null) {
                continue;
            }
            Instant bookingInstant = booking.getBookingDate().atTime(booking.getBookingTime()).toInstant(java.time.ZoneOffset.UTC);
            if (bookingInstant.isBefore(now)) {
                cancelBookingById(booking.getId());
                updated++;
            }
        }

        return updated;
    }

    @Transactional
    public Booking createOrReplaceBooking(Booking booking) {
        if (booking.getId() == null || booking.getId().isBlank()) {
            throw new IllegalArgumentException("Booking id is required");
        }
        return bookingRepository.save(booking);
    }

    @Transactional
    public BookingResponse createOrReplaceBookingResponse(Booking booking) {
        if (booking.getId() == null || booking.getId().isBlank()) {
            throw new IllegalArgumentException("Booking id is required");
        }
        return bookingMapper.toDto(bookingRepository.save(booking));
    }
}
