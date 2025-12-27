package com.tcs.boot.service;


import org.springframework.stereotype.Service;

import com.tcs.boot.entity.Order;
import com.tcs.boot.enums.OrderStatus;
import com.tcs.boot.exception.OrderCancellationNotAllowedException;
import com.tcs.boot.exception.OrderModificationNotAllowedException;
import com.tcs.boot.exception.OrderNotFoundException;
import com.tcs.boot.repository.OrderRepository;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class OrderServiceImpl implements OrderService {

	private final OrderRepository orderRepository;
    private final EmailService emailService;

    public OrderServiceImpl(OrderRepository orderRepository,
                            EmailService emailService) {
        this.orderRepository = orderRepository;
        this.emailService = emailService;
    }

    @Override
    public Order placeOrder(Order order) {

        order.setOrderId(UUID.randomUUID().toString());
        order.setStatus(OrderStatus.PLACED);
        order.setOrderDate(LocalDateTime.now());
        order.setEstimatedDelivery(LocalDateTime.now().plusDays(5));

        order.getItems().forEach(item -> item.setOrder(order));

        Order savedOrder = orderRepository.save(order);

        // Mock notifications
        //sendEmail(savedOrder.getOrderId());
        emailService.sendOrderPlacedEmail(
        		savedOrder.getCustomerEmail(),   // later fetch from DB saipavankommi1510@gmail.com
                savedOrder.getOrderId()
        );
        sendSMS(savedOrder.getOrderId());

        return savedOrder;
    }

    @Override
    public Order getOrderByOrderId(String orderId) {
        return orderRepository.findByOrderId(orderId)
                .orElseThrow(() ->
                new OrderNotFoundException("Order not found with ID: " + orderId)
        );
    }

    @Override
    public Order updateOrder(String orderId, Order updatedOrder) {

        Order existingOrder = getOrderByOrderId(orderId);
        
        if (existingOrder.getStatus() == OrderStatus.SHIPPED) {
            throw new OrderModificationNotAllowedException(
                    "Order cannot be modified after shipping"
            );
        }

        existingOrder.setItems(updatedOrder.getItems());
        existingOrder.setTotalAmount(updatedOrder.getTotalAmount());

        return orderRepository.save(existingOrder);
    }

    @Override
    public void cancelOrder(String orderId) {
        
        Order order = orderRepository.findByOrderId(orderId)
                .orElseThrow(() ->
                        new OrderNotFoundException("Order not found with ID: " + orderId)
                );

       
        
        if (order.getStatus() == OrderStatus.SHIPPED ||
                order.getStatus() == OrderStatus.DELIVERED) {
                throw new OrderCancellationNotAllowedException(
                        "Order cannot be cancelled once shipped or delivered"
                );
            }

        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);

        // ✅ SEND CANCELLATION EMAIL
        emailService.sendOrderCancelledEmail(
                order.getCustomerEmail(),   // later fetch from customer table
                order.getOrderId()
        );
    }

    @Override
    public Order trackOrder(String orderId) {
        return getOrderByOrderId(orderId);
    }

    private void sendEmail(String orderId) {
        System.out.println("Email sent for Order: " + orderId);
    }

    private void sendSMS(String orderId) {
        System.out.println("SMS sent for Order: " + orderId);
    }
}
