package com.bitehub.service;

import com.bitehub.domain.entity.Feedback;
import com.bitehub.domain.entity.Seat;
import com.bitehub.domain.entity.Restaurant;
import com.bitehub.domain.enums.SeatStatus;
import com.bitehub.dto.RestaurantFeedbackStatsResponse;
import com.bitehub.dto.RestaurantResponse;
import com.bitehub.dto.feedback.FeedbackResponse;
import com.bitehub.dto.seat.SeatResponse;
import com.bitehub.mapper.FeedbackMapper;
import com.bitehub.mapper.RestaurantMapper;
import com.bitehub.mapper.SeatMapper;
import com.bitehub.repository.FeedbackRepository;
import com.bitehub.repository.RestaurantRepository;
import com.bitehub.repository.SeatRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final FeedbackRepository feedbackRepository;
    private final SeatRepository seatRepository;
    private final RestaurantMapper restaurantMapper;
    private final FeedbackMapper feedbackMapper;
    private final SeatMapper seatMapper;

    public RestaurantService(
            RestaurantRepository restaurantRepository,
            FeedbackRepository feedbackRepository,
            SeatRepository seatRepository,
            RestaurantMapper restaurantMapper
            , FeedbackMapper feedbackMapper,
            SeatMapper seatMapper
    ) {
        this.restaurantRepository = restaurantRepository;
        this.feedbackRepository = feedbackRepository;
        this.seatRepository = seatRepository;
        this.restaurantMapper = restaurantMapper;
        this.feedbackMapper = feedbackMapper;
        this.seatMapper = seatMapper;
    }

    @Transactional
    public List<RestaurantResponse> getRestaurantList() {
        return restaurantRepository.findAllByOrderByRatingDesc().stream().map(restaurantMapper::toDto).toList();
    }

    @Transactional
    public RestaurantResponse getRestaurantById(String id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Restaurant not found."));
        return restaurantMapper.toDto(restaurant);
    }

    @Transactional
    public List<String> getRestaurantMenu(String id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Restaurant not found."));
        return restaurant.getMenuItems();
    }

    @Transactional
    public List<SeatResponse> getRestaurantSeats(String id, String date, String time) {
        List<Seat> seats = seatRepository.findByRestaurant_Id(id);
        return seats.stream()
                .filter(seat -> seat.getStatus() == SeatStatus.AVAILABLE)
                .map(seatMapper::toDto)
                .toList();
    }

    @Transactional
    public RestaurantFeedbackStatsResponse getRestaurantFeedbackStats(String restaurantId) {
        List<FeedbackResponse> allReviews = feedbackRepository.findByRestaurant_Id(restaurantId).stream()
                .sorted(Comparator.comparing(Feedback::getSubmittedAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                .map(feedbackMapper::toDto)
                .toList();

        double averageRating = allReviews.isEmpty()
                ? 0.0d
                : allReviews.stream().mapToInt(FeedbackResponse::rating).average().orElse(0.0d);

        return new RestaurantFeedbackStatsResponse(
                allReviews.size(),
                averageRating,
                allReviews,
                allReviews.stream().limit(6).toList()
        );
    }
}
