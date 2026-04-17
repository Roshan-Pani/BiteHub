package com.bitehub.mapper;

import com.bitehub.config.MapStructConfig;
import com.bitehub.domain.entity.Booking;
import com.bitehub.domain.entity.BookingCancellation;
import com.bitehub.domain.entity.BookingGuest;
import com.bitehub.domain.entity.BookingPricing;
import com.bitehub.domain.entity.BookingTimelineEntry;
import com.bitehub.dto.booking.BookingCancellationResponse;
import com.bitehub.dto.booking.BookingGuestResponse;
import com.bitehub.dto.booking.BookingPricingResponse;
import com.bitehub.dto.booking.BookingResponse;
import com.bitehub.dto.booking.BookingTimelineEntryResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(config = MapStructConfig.class)
public interface BookingMapper {

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "restaurantId", source = "restaurant.id")
    @Mapping(target = "restaurantName", source = "restaurant.name")
    @Mapping(target = "date", expression = "java(booking.getBookingDate() == null ? null : booking.getBookingDate().toString())")
    @Mapping(target = "time", expression = "java(booking.getBookingTime() == null ? null : booking.getBookingTime().toString())")
    BookingResponse toDto(Booking booking);

    BookingGuestResponse toDto(BookingGuest guest);

    BookingTimelineEntryResponse toDto(BookingTimelineEntry entry);

    BookingCancellationResponse toDto(BookingCancellation cancellation);

    BookingPricingResponse toDto(BookingPricing pricing);

    default String mapEnumName(Enum<?> value) {
        return value == null ? null : value.name();
    }

    default List<BookingGuestResponse> mapGuests(List<BookingGuest> guests) {
        return guests == null ? List.of() : guests.stream().map(this::toDto).toList();
    }

    default List<BookingTimelineEntryResponse> mapTimeline(List<BookingTimelineEntry> entries) {
        return entries == null ? List.of() : entries.stream().map(this::toDto).toList();
    }
}
