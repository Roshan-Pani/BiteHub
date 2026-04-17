package com.bitehub.repository;

import com.bitehub.domain.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RestaurantRepository extends JpaRepository<Restaurant, String> {
    List<Restaurant> findAllByOrderByRatingDesc();
}
