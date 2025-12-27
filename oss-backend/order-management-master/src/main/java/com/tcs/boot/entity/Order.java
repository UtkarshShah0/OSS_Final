package com.tcs.boot.entity;


import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.tcs.boot.enums.OrderStatus;

@Entity
@Table(name = "orders")
//@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String orderId;

    private Long customerId;
    
    private String customerEmail;  

    public String getCustomerEmail() {
		return customerEmail;
	}

	public void setCustomerEmail(String customerEmail) {
		this.customerEmail = customerEmail;
	}

	private Double totalAmount;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    private LocalDateTime orderDate;

    private LocalDateTime estimatedDelivery;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<OrderItem> items;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Long getCustomerId() {
		return customerId;
	}

	public void setCustomerId(Long customerId) {
		this.customerId = customerId;
	}

	public Double getTotalAmount() {
		return totalAmount;
	}

	public void setTotalAmount(Double totalAmount) {
		this.totalAmount = totalAmount;
	}

	public OrderStatus getStatus() {
		return status;
	}

	public void setStatus(OrderStatus status) {
		this.status = status;
	}

	public LocalDateTime getOrderDate() {
		return orderDate;
	}

	public void setOrderDate(LocalDateTime orderDate) {
		this.orderDate = orderDate;
	}

	public LocalDateTime getEstimatedDelivery() {
		return estimatedDelivery;
	}

	public void setEstimatedDelivery(LocalDateTime estimatedDelivery) {
		this.estimatedDelivery = estimatedDelivery;
	}

	public List<OrderItem> getItems() {
		return items;
	}

	public void setItems(List<OrderItem> items) {
		this.items = items;
	}

	public Order(Long id, String orderId, Long customerId, Double totalAmount, OrderStatus status,
			LocalDateTime orderDate, LocalDateTime estimatedDelivery, List<OrderItem> items) {
		super();
		this.id = id;
		this.orderId = orderId;
		this.customerId = customerId;
		this.totalAmount = totalAmount;
		this.status = status;
		this.orderDate = orderDate;
		this.estimatedDelivery = estimatedDelivery;
		this.items = items;
	}

	public Order() {
		super();
	}
    
    
    
}
