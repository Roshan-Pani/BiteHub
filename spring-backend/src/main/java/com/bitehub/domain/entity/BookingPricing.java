package com.bitehub.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "booking_pricing")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookingPricing extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false, unique = true)
    private Booking booking;

    @Column(name = "booking_base", precision = 12, scale = 2)
    private BigDecimal bookingBase;

    @Column(name = "cost_per_seat", precision = 12, scale = 2)
    private BigDecimal costPerSeat;

    @Column(name = "selected_seat_count")
    private Integer selectedSeatCount;

    @Column(precision = 12, scale = 2)
    private BigDecimal subtotal;

    @Column(precision = 12, scale = 2)
    private BigDecimal discount;

    @Column(precision = 12, scale = 2)
    private BigDecimal total;
}
