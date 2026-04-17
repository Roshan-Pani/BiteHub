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

import java.time.Instant;

@Entity
@Table(name = "booking_status_timeline")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookingTimelineEntry extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Column(name = "event_type")
    private String eventType;

    @Column(name = "status_value")
    private String statusValue;

    @Column(name = "event_at", nullable = false)
    private Instant eventAt;

    @Column(columnDefinition = "TEXT")
    private String note;
}
