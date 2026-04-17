package com.bitehub.domain.value;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantLocation {
    private String country;
    private String state;
    private String district;
    private String city;
    private String pin;
    private String specialIdentification;
}
