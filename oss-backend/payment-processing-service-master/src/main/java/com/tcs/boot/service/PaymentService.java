package com.tcs.boot.service;

import org.springframework.stereotype.Repository;

import com.tcs.boot.dto.PaymentRequestDTO;
import com.tcs.boot.entity.Payment;

@Repository
public interface PaymentService {
	
	Payment processPayment(PaymentRequestDTO request);

}
