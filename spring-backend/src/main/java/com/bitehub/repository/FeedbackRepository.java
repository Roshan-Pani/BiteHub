package com.bitehub.repository;

import com.bitehub.domain.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FeedbackRepository extends JpaRepository<Feedback, String> {
    Optional<Feedback> findByBooking_Id(String bookingId);

    List<Feedback> findByRestaurant_Id(String restaurantId);

    List<Feedback> findByUser_Id(String userId);
}
