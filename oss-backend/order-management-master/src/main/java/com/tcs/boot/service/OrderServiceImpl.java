package com.tcs.boot.service;


import org.springframework.stereotype.Service;

import com.tcs.boot.client.UserClient;
import com.tcs.boot.entity.Order;
import com.tcs.boot.entity.OrderItem;
import com.tcs.boot.enums.OrderStatus;
import com.tcs.boot.exception.OrderCancellationNotAllowedException;
import com.tcs.boot.exception.OrderModificationNotAllowedException;
import com.tcs.boot.exception.OrderNotFoundException;
import com.tcs.boot.repository.OrderRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class OrderServiceImpl implements OrderService {

	private final OrderRepository orderRepository;
    private final EmailService emailService;
    private final UserClient userClient;

    public OrderServiceImpl(OrderRepository orderRepository,
                            EmailService emailService,
                            UserClient userClient) {
        this.orderRepository = orderRepository;
        this.emailService = emailService;
        this.userClient = userClient;
    }

    @Override
    public Order placeOrder(Order order) {

        order.setOrderId(UUID.randomUUID().toString());
        order.setStatus(OrderStatus.PLACED);
        order.setOrderDate(LocalDateTime.now());
        order.setEstimatedDelivery(LocalDateTime.now().plusDays(5));

        // Set customer email if not provided
        if (order.getCustomerEmail() == null && order.getCustomerId() != null) {
            try {
                Map<String, Object> userDetails = userClient.getUserDetails(order.getCustomerId());
                order.setCustomerEmail((String) userDetails.get("email"));
            } catch (Exception e) {
                System.err.println("Could not fetch user email: " + e.getMessage());
            }
        }

        order.getItems().forEach(item -> item.setOrder(order));

        Order savedOrder = orderRepository.save(order);

        // Send email notification
        if (savedOrder.getCustomerEmail() != null) {
            emailService.sendOrderPlacedEmail(
                    savedOrder.getCustomerEmail(),
                    savedOrder.getOrderId()
            );
        }
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
    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByCustomerId(userId);
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

        // Send cancellation email
        if (order.getCustomerEmail() != null) {
            emailService.sendOrderCancelledEmail(
                    order.getCustomerEmail(),
                    order.getOrderId()
            );
        }
    }

    @Override
    public Order trackOrder(String orderId) {
        return getOrderByOrderId(orderId);
    }

    @Override
    public Map<String, Object> createOrderFromMap(Map<String, Object> orderData) {
        Order order = new Order();
        order.setCustomerId(((Number) orderData.get("userId")).longValue());
        order.setTotalAmount(((Number) orderData.get("amount")).doubleValue());
        
        // Get user email
        try {
            Map<String, Object> userDetails = userClient.getUserDetails(order.getCustomerId());
            order.setCustomerEmail((String) userDetails.get("email"));
        } catch (Exception e) {
            System.err.println("Could not fetch user email: " + e.getMessage());
        }

        // Create order items
        List<OrderItem> items = new ArrayList<>();
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> itemsData = (List<Map<String, Object>>) orderData.get("items");
        
        for (Map<String, Object> itemData : itemsData) {
            OrderItem item = new OrderItem();
            item.setProductId(((Number) itemData.get("productId")).longValue());
            item.setQuantity(((Number) itemData.get("quantity")).intValue());
            item.setPrice(Double.parseDouble(itemData.getOrDefault("unitPrice", "0").toString()));
            items.add(item);
        }
        order.setItems(items);

        Order savedOrder = placeOrder(order);
        
        Map<String, Object> response = new HashMap<>();
        response.put("id", savedOrder.getId());
        response.put("orderId", savedOrder.getOrderId());
        response.put("status", savedOrder.getStatus());
        response.put("totalAmount", savedOrder.getTotalAmount());
        response.put("orderDate", savedOrder.getOrderDate());
        
        return response;
    }

    private void sendSMS(String orderId) {
        System.out.println("SMS sent for Order: " + orderId);
    }
}
