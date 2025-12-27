package com.tcs.boot.dto;

import com.tcs.boot.entity.PaymentMethod;

public class PaymentRequestDTO {

	private String orderId;
	private Double amount;
	private PaymentMethod paymentMethod;
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
	public PaymentRequestDTO(String orderId, Double amount, PaymentMethod paymentMethod) {
		super();
		this.orderId = orderId;
		this.amount = amount;
		this.paymentMethod = paymentMethod;
	}
	public PaymentRequestDTO() {
		super();
	}
	
	
	
}
