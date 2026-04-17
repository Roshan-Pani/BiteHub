package com.bitehub.service;

import com.bitehub.domain.entity.Payment;
import com.bitehub.dto.payment.PaymentResponse;
import com.bitehub.mapper.PaymentMapper;
import com.bitehub.repository.PaymentRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentMapper paymentMapper;

    public PaymentService(PaymentRepository paymentRepository, PaymentMapper paymentMapper) {
        this.paymentRepository = paymentRepository;
        this.paymentMapper = paymentMapper;
    }

    public List<Payment> getPaymentList(String bookingId, String userId, String restaurantId, String status) {
        if (bookingId != null) {
            return paymentRepository.findAll().stream().filter(item -> bookingId.equals(item.getBooking().getId())).toList();
        }
        if (userId != null) {
            return paymentRepository.findByUser_Id(userId);
        }
        if (restaurantId != null) {
            return paymentRepository.findByRestaurant_Id(restaurantId);
        }
        if (status != null) {
            return paymentRepository.findAll().stream().filter(item -> status.equalsIgnoreCase(item.getStatus())).toList();
        }
        return paymentRepository.findAll();
    }

    @Transactional
    public List<PaymentResponse> getPaymentResponseList(String bookingId, String userId, String restaurantId, String status) {
        return getPaymentList(bookingId, userId, restaurantId, status).stream().map(paymentMapper::toDto).toList();
    }

    @Transactional
    public Payment upsertPaymentRecord(Payment payment) {
        if (payment.getId() == null || payment.getId().isBlank()) {
            throw new IllegalArgumentException("Payment id is required");
        }
        return paymentRepository.save(payment);
    }

    @Transactional
    public PaymentResponse upsertPaymentResponse(Payment payment) {
        if (payment.getId() == null || payment.getId().isBlank()) {
            throw new IllegalArgumentException("Payment id is required");
        }
        return paymentMapper.toDto(paymentRepository.save(payment));
    }
}
