package com.bitehub.mapper;

import com.bitehub.config.MapStructConfig;
import com.bitehub.domain.entity.Restaurant;
import com.bitehub.dto.RestaurantResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(config = MapStructConfig.class)
public interface RestaurantMapper {

    @Mapping(target = "city", source = "location.city")
    @Mapping(target = "district", source = "location.district")
    @Mapping(target = "cuisineName", source = "cuisine.name")
    RestaurantResponse toDto(Restaurant restaurant);
}
