package com.bitehub.repository;

import com.bitehub.domain.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, String> {
    Optional<Payment> findByBooking_Id(String bookingId);

    List<Payment> findByUser_Id(String userId);

    List<Payment> findByRestaurant_Id(String restaurantId);
}
