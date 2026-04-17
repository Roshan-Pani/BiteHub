package com.bitehub.controller;

import com.bitehub.dto.RestaurantFeedbackStatsResponse;
import com.bitehub.dto.RestaurantResponse;
import com.bitehub.dto.seat.SeatResponse;
import com.bitehub.service.RestaurantService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    private final RestaurantService restaurantService;

    public RestaurantController(RestaurantService restaurantService) {
        this.restaurantService = restaurantService;
    }

    @GetMapping
    public ResponseEntity<List<RestaurantResponse>> getRestaurants() {
        return ResponseEntity.ok(restaurantService.getRestaurantList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RestaurantResponse> getRestaurant(@PathVariable String id) {
        return ResponseEntity.ok(restaurantService.getRestaurantById(id));
    }

    @GetMapping("/{id}/menu")
    public ResponseEntity<List<String>> getMenu(@PathVariable String id) {
        return ResponseEntity.ok(restaurantService.getRestaurantMenu(id));
    }

    @GetMapping("/{id}/seats")
    public ResponseEntity<List<SeatResponse>> getSeats(
            @PathVariable String id,
            @RequestParam(required = false) String date,
            @RequestParam(required = false) String time
    ) {
        return ResponseEntity.ok(restaurantService.getRestaurantSeats(id, date, time));
    }

    @GetMapping("/{id}/feedback-stats")
    public ResponseEntity<RestaurantFeedbackStatsResponse> getFeedbackStats(@PathVariable String id) {
        return ResponseEntity.ok(restaurantService.getRestaurantFeedbackStats(id));
    }
}
