package com.bitehub.repository;

import com.bitehub.domain.entity.Booking;
import com.bitehub.domain.enums.BookingStatus;
import com.bitehub.domain.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, String> {
    List<Booking> findByUser_IdOrderByBookingDateDesc(String userId);

    List<Booking> findByRestaurant_IdOrderByBookingDateDesc(String restaurantId);

    List<Booking> findByBookingStatus(BookingStatus bookingStatus);

    List<Booking> findByPaymentStatus(PaymentStatus paymentStatus);

    List<Booking> findByUser_IdAndBookingStatusOrderByBookingDateDesc(String userId, BookingStatus bookingStatus);
}
