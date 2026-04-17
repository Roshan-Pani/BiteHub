package com.bitehub.mapper;

import com.bitehub.config.MapStructConfig;
import com.bitehub.domain.entity.Seat;
import com.bitehub.dto.seat.SeatResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(config = MapStructConfig.class)
public interface SeatMapper {

    @Mapping(target = "restaurantId", source = "restaurant.id")
    @Mapping(target = "status", expression = "java(seat.getStatus() == null ? null : seat.getStatus().name())")
    SeatResponse toDto(Seat seat);
}
