package com.bitehub.mapper;

import com.bitehub.config.MapStructConfig;
import com.bitehub.domain.entity.Feedback;
import com.bitehub.dto.feedback.FeedbackResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(config = MapStructConfig.class)
public interface FeedbackMapper {

    @Mapping(target = "bookingId", source = "booking.id")
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "restaurantId", source = "restaurant.id")
    FeedbackResponse toDto(Feedback feedback);
}
