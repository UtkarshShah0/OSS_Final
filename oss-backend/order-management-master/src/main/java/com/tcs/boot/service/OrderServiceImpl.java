package com.tcs.boot.service;


import org.springframework.stereotype.Service;
import org.springframework.http.ResponseEntity;

import com.tcs.boot.client.UserClient;
import com.tcs.boot.client.ProductClient;
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
    private final ProductClient productClient;

    public OrderServiceImpl(OrderRepository orderRepository,
                            EmailService emailService,
                            UserClient userClient,
                            ProductClient productClient) {
        this.orderRepository = orderRepository;
        this.emailService = emailService;
        this.userClient = userClient;
        this.productClient = productClient;
    }

    @Override
    public Order placeOrder(Order order) {
        // Generate orderId if not set
        if (order.getOrderId() == null || order.getOrderId().isEmpty()) {
            order.setOrderId(UUID.randomUUID().toString());
        }
        
        order.setStatus(OrderStatus.PLACED);
        
        // Only set order date if not already set (preserve frontend date)
        if (order.getOrderDate() == null) {
            order.setOrderDate(LocalDateTime.now());
        }
        
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

        // Set order reference for items (check for null first)
        if (order.getItems() != null && !order.getItems().isEmpty()) {
            order.getItems().forEach(item -> item.setOrder(order));
        }

        // Reduce inventory for each order item
        if (order.getItems() != null && !order.getItems().isEmpty()) {
            for (OrderItem item : order.getItems()) {
                try {
                    // Check stock availability first
                    ResponseEntity<Boolean> stockCheck = productClient.checkStockAvailability(
                        item.getProductId(), item.getQuantity());
                    
                    if (stockCheck.getBody() != null && stockCheck.getBody()) {
                        // Reduce stock
                        ResponseEntity<String> result = productClient.reduceStock(
                            item.getProductId(), item.getQuantity());
                        
                        if (result.getStatusCode().is2xxSuccessful()) {
                            System.out.println("Successfully reduced stock for product " + 
                                             item.getProductId() + " by " + item.getQuantity());
                        } else {
                            System.err.println("Failed to reduce stock for product " + 
                                             item.getProductId() + ": " + result.getBody());
                        }
                    } else {
                        System.err.println("Insufficient stock for product " + item.getProductId() + 
                                         ". Quantity requested: " + item.getQuantity());
                        // Note: In a production system, you might want to throw an exception here
                        // or implement a more sophisticated inventory reservation system
                    }
                } catch (Exception e) {
                    System.err.println("Error reducing inventory for product " + 
                                     item.getProductId() + ": " + e.getMessage());
                    // Continue with order processing even if inventory update fails
                    // In production, you might want to implement compensation logic
                }
            }
        }

        Order savedOrder = orderRepository.save(order);

        // Send comprehensive email notification
        if (savedOrder.getCustomerEmail() != null) {
            try {
                emailService.sendDetailedOrderPlacedEmail(savedOrder);
            } catch (Exception e) {
                System.err.println("Could not send email: " + e.getMessage());
            }
        }
        sendSMS(savedOrder.getOrderId());

        return savedOrder;
    }

    @Override
    public Order createOrderFromFrontend(Map<String, Object> orderData) {
        Order order = new Order();
        
        // Debug logging
        System.out.println("Received order data: " + orderData);
        
        // Don't set the database ID - let it auto-generate
        // Set the orderId from the frontend's 'id' field
        String frontendOrderId = (String) orderData.get("id");
        if (frontendOrderId != null) {
            order.setOrderId(frontendOrderId);
        } else {
            order.setOrderId(UUID.randomUUID().toString());
        }
        
        // Basic order info
        Long customerId = getUserIdFromOrderData(orderData);
        System.out.println("Extracted customer ID: " + customerId);
        order.setCustomerId(customerId);
        
        // Extract total amount
        Object totalObj = orderData.get("total");
        if (totalObj != null) {
            order.setTotalAmount(((Number) totalObj).doubleValue());
            System.out.println("Set total amount: " + order.getTotalAmount());
        }
        
        // Handle optional price breakdown fields
        if (orderData.containsKey("subtotal")) {
            order.setSubtotal(((Number) orderData.get("subtotal")).doubleValue());
        }
        if (orderData.containsKey("shipping")) {
            order.setShipping(((Number) orderData.get("shipping")).doubleValue());
        }
        if (orderData.containsKey("tax")) {
            order.setTax(((Number) orderData.get("tax")).doubleValue());
        }
        if (orderData.containsKey("discount")) {
            order.setDiscount(((Number) orderData.get("discount")).doubleValue());
        }
        
        // Handle date from frontend
        if (orderData.containsKey("date")) {
            try {
                String dateStr = (String) orderData.get("date");
                if (dateStr != null && !dateStr.isEmpty()) {
                    // Parse ISO date string to LocalDateTime
                    order.setOrderDate(LocalDateTime.parse(dateStr.replace("Z", "")));
                    System.out.println("Set order date from frontend: " + order.getOrderDate());
                }
            } catch (Exception e) {
                System.err.println("Could not parse date from frontend, using current time: " + e.getMessage());
                order.setOrderDate(LocalDateTime.now());
            }
        } else {
            order.setOrderDate(LocalDateTime.now());
        }
        
        // Get user email
        if (order.getCustomerId() != null) {
            try {
                Map<String, Object> userDetails = userClient.getUserDetails(order.getCustomerId());
                order.setCustomerEmail((String) userDetails.get("email"));
                System.out.println("Set customer email: " + order.getCustomerEmail());
            } catch (Exception e) {
                System.err.println("Could not fetch user email: " + e.getMessage());
            }
        }

        // Shipping Address
        @SuppressWarnings("unchecked")
        Map<String, Object> shippingAddress = (Map<String, Object>) orderData.get("shippingAddress");
        if (shippingAddress != null) {
            order.setShippingFullName((String) shippingAddress.get("fullName"));
            order.setShippingPhone((String) shippingAddress.get("phone"));
            order.setShippingAddressLine1((String) shippingAddress.get("addressLine1"));
            order.setShippingAddressLine2((String) shippingAddress.get("addressLine2"));
            order.setShippingCity((String) shippingAddress.get("city"));
            order.setShippingState((String) shippingAddress.get("state"));
            order.setShippingZipCode((String) shippingAddress.get("zipCode"));
            order.setShippingCountry((String) shippingAddress.get("country"));
            System.out.println("Set shipping address for: " + order.getShippingFullName());
        }

        // Payment Method
        @SuppressWarnings("unchecked")
        Map<String, Object> paymentMethod = (Map<String, Object>) orderData.get("paymentMethod");
        if (paymentMethod != null) {
            order.setPaymentType((String) paymentMethod.get("type"));
            
            String paymentDetails = "";
            String paymentProvider = "";
            
            String paymentType = (String) paymentMethod.get("type");
            if (paymentType != null) {
                switch (paymentType) {
                    case "card":
                        String cardNumber = (String) paymentMethod.get("cardNumber");
                        if (cardNumber != null && cardNumber.length() > 4) {
                            paymentDetails = "**** **** **** " + cardNumber.substring(cardNumber.length() - 4);
                        }
                        String cardHolder = (String) paymentMethod.get("cardHolder");
                        if (cardHolder != null) {
                            paymentDetails += " - " + cardHolder;
                        }
                        break;
                    case "upi":
                        paymentDetails = (String) paymentMethod.get("upiId");
                        break;
                    case "cod":
                        paymentDetails = "Cash on Delivery";
                        break;
                    case "bnpl":
                        paymentProvider = (String) paymentMethod.get("bnplProvider");
                        paymentDetails = "Buy Now Pay Later - " + paymentProvider;
                        break;
                }
            }
            
            order.setPaymentDetails(paymentDetails);
            order.setPaymentProvider(paymentProvider);
            System.out.println("Set payment method: " + paymentType + " - " + paymentDetails);
        }

        // Order Items
        List<OrderItem> items = new ArrayList<>();
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> itemsData = (List<Map<String, Object>>) orderData.get("items");
        
        if (itemsData != null) {
            for (Map<String, Object> itemData : itemsData) {
                OrderItem item = new OrderItem();
                item.setProductId(((Number) itemData.get("productId")).longValue());
                item.setProductName((String) itemData.get("productName"));
                item.setProductImage((String) itemData.get("productImage"));
                item.setQuantity(((Number) itemData.get("quantity")).intValue());
                item.setPrice(((Number) itemData.get("price")).doubleValue());
                
                // Calculate total if not provided
                if (itemData.containsKey("total")) {
                    item.setTotal(((Number) itemData.get("total")).doubleValue());
                } else {
                    item.setTotal(item.getPrice() * item.getQuantity());
                }
                items.add(item);
                System.out.println("Added item: " + item.getProductName() + " x " + item.getQuantity());
            }
        }
        order.setItems(items);

        return placeOrder(order);
    }

    private Long getUserIdFromOrderData(Map<String, Object> orderData) {
        // Try to extract user ID from various possible locations in the order data
        if (orderData.containsKey("userId")) {
            Object userId = orderData.get("userId");
            if (userId instanceof Number) {
                return ((Number) userId).longValue();
            }
        }
        if (orderData.containsKey("customerId")) {
            Object customerId = orderData.get("customerId");
            if (customerId instanceof Number) {
                return ((Number) customerId).longValue();
            }
        }
        // Could also extract from nested user object if present
        return null;
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
            item.setTotal(item.getPrice() * item.getQuantity());
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
