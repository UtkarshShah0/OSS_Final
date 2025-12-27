package com.tcs.boot.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Builder;

@Entity
@Builder
public class Payment {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String paymentId;
	private String orderId;
	private Double amount;
	
	@Enumerated(EnumType.STRING)
	private PaymentMethod paymentMethod;
	
	private PaymentStatus status;
	
	private LocalDateTime paymentDate;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getPaymentId() {
		return paymentId;
	}

	public void setPaymentId(String paymentId) {
		this.paymentId = paymentId;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Double getAmount() {
		return amount;
	}

	public void setAmount(Double amount) {
		this.amount = amount;
	}

	public PaymentMethod getPaymentMethod() {
		return paymentMethod;
	}

	public void setPaymentMethod(PaymentMethod paymentMethod) {
		this.paymentMethod = paymentMethod;
	}

	public PaymentStatus getStatus() {
		return status;
	}

	public void setStatus(PaymentStatus status) {
		this.status = status;
	}

	public LocalDateTime getPaymentDate() {
		return paymentDate;
	}

	public void setPaymentDate(LocalDateTime paymentDate) {
		this.paymentDate = paymentDate;
	}

	public Payment(Long id, String paymentId, String orderId, Double amount, PaymentMethod paymentMethod,
			PaymentStatus status, LocalDateTime paymentDate) {
		super();
		this.id = id;
		this.paymentId = paymentId;
		this.orderId = orderId;
		this.amount = amount;
		this.paymentMethod = paymentMethod;
		this.status = status;
		this.paymentDate = paymentDate;
	}

	public Payment() {
		super();
	}
	
	
}
