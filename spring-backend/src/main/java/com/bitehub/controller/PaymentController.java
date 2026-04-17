package com.bitehub.controller;

import com.bitehub.domain.entity.Payment;
import com.bitehub.dto.payment.PaymentResponse;
import com.bitehub.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping
    public ResponseEntity<List<PaymentResponse>> getPayments(
            @RequestParam(required = false) String bookingId,
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) String restaurantId,
            @RequestParam(required = false) String status
    ) {
        return ResponseEntity.ok(paymentService.getPaymentResponseList(bookingId, userId, restaurantId, status));
    }

    @PostMapping
    public ResponseEntity<PaymentResponse> savePayment(@RequestBody Payment payment) {
        return ResponseEntity.ok(paymentService.upsertPaymentResponse(payment));
    }
}
