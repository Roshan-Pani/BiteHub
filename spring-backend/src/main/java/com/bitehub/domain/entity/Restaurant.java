package com.bitehub.domain.entity;

import com.bitehub.domain.value.RestaurantCuisine;
import com.bitehub.domain.value.RestaurantLocation;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "restaurants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Restaurant extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Embedded
    private RestaurantLocation location;

    @Embedded
    private RestaurantCuisine cuisine;

    @Column(name = "is_veg_only", nullable = false)
    private boolean vegOnly;

    @Column(name = "has_ac", nullable = false)
    private boolean hasAc;

    @Column(nullable = false)
    private double rating = 0.0d;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "restaurant_images", joinColumns = @JoinColumn(name = "restaurant_id"))
    @Column(name = "image_url", length = 1024)
    private List<String> images = new ArrayList<>();

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "restaurant_menu_items", joinColumns = @JoinColumn(name = "restaurant_id"))
    @Column(name = "menu_item", length = 255)
    private List<String> menuItems = new ArrayList<>();

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "restaurant_off_days", joinColumns = @JoinColumn(name = "restaurant_id"))
    @Column(name = "off_day", length = 32)
    private List<String> offDays = new ArrayList<>();

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "restaurant_meal_types", joinColumns = @JoinColumn(name = "restaurant_id"))
    @Column(name = "meal_type", length = 32)
    private List<String> mealTypes = new ArrayList<>();

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "restaurant_service_days", joinColumns = @JoinColumn(name = "restaurant_id"))
    @Column(name = "service_day", length = 32)
    private List<String> serviceDays = new ArrayList<>();

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "restaurant_unavailable_dates", joinColumns = @JoinColumn(name = "restaurant_id"))
    @Column(name = "unavailable_date", length = 32)
    private List<String> unavailableDates = new ArrayList<>();

    @Column(name = "opening_time", length = 16)
    private String openingTime;

    @Column(name = "closing_time", length = 16)
    private String closingTime;

    @Column(name = "special_messages", columnDefinition = "TEXT")
    private String specialMessages;

    @Column(nullable = false)
    private String source = "seed";

    @OneToMany(mappedBy = "restaurant", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RestaurantTableType> tableTypes = new ArrayList<>();
}
