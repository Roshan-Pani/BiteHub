package com.bitehub.dto;

import java.util.List;

public record RestaurantResponse(
        String id,
        String name,
        String city,
        String district,
        String cuisineName,
        double rating,
        boolean vegOnly,
        boolean hasAc,
        List<String> images,
        List<String> menuItems,
        String openingTime,
        String closingTime,
        String specialMessages,
        String source
) {
}
