package com.tcs.boot.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.tcs.boot.dto.PaymentRequestDTO;
import com.tcs.boot.entity.Payment;
import com.tcs.boot.entity.PaymentMethod;
import com.tcs.boot.entity.PaymentStatus;
import com.tcs.boot.repository.PaymentRepository;

@Service
public class PaymentServiceImpl implements PaymentService{
	
	private final PaymentRepository paymentRepository;
	
	public PaymentServiceImpl(PaymentRepository paymentRepository) {
		this.paymentRepository = paymentRepository;
	}

	@Override
	public Payment processPayment(PaymentRequestDTO request) {
		// TODO Auto-generated method stub
		
		Payment payment = new Payment();
		payment.setPaymentId(UUID.randomUUID().toString());
		payment.setOrderId(request.getOrderId());
		payment.setAmount(request.getAmount());
		payment.setPaymentMethod(request.getPaymentMethod());
		payment.setPaymentDate(LocalDateTime.now());
		payment.setStatus(processByMethod(request.getPaymentMethod()));
		return paymentRepository.save(payment);
	}

	private PaymentStatus processByMethod(PaymentMethod paymentMethod) {

		switch (paymentMethod) {
		case CARD:
			return PaymentStatus.SUCCESS;
		case WALLET:
			return PaymentStatus.SUCCESS;
		case BNPL:
			return PaymentStatus.SUCCESS;
		default:
			return PaymentStatus.SUCCESS;
			
		}
		
	}
	
	
	
	
	

}
