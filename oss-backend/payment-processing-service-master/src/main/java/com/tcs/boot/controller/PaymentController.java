package com.tcs.boot.controller;

import org.springframework.http.ResponseEntity;

import com.tcs.boot.dto.PaymentRequestDTO;
import com.tcs.boot.entity.Payment;
import com.tcs.boot.service.PaymentService;


import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/payments")
public class PaymentController {
	
	private final PaymentService paymentService;
	
	public PaymentController(PaymentService paymentService) {
		this.paymentService = paymentService;
	}
	
	@PostMapping
	public ResponseEntity<Payment> makePayment(@RequestBody PaymentRequestDTO request){
		return ResponseEntity.ok(paymentService.processPayment(request));
	}

}
