package com.bitehub.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "restaurant_table_types")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantTableType extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;

    @Column(name = "type_name", nullable = false)
    private String typeName;

    @Column(name = "seats_per_table", nullable = false)
    private int seatsPerTable;

    @Column(nullable = false)
    private int quantity = 1;
}
