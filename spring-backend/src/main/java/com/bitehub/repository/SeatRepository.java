package com.bitehub.repository;

import com.bitehub.domain.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SeatRepository extends JpaRepository<Seat, String> {
    List<Seat> findByRestaurant_Id(String restaurantId);
}
