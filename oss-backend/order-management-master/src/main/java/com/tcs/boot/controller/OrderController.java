package com.tcs.boot.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tcs.boot.entity.Order;
import com.tcs.boot.service.OrderService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // Place Order - accepts complete order data from frontend
    @PostMapping("/")
    public ResponseEntity<Order> placeOrder(@RequestBody Map<String, Object> orderData) {
        return ResponseEntity.ok(orderService.createOrderFromFrontend(orderData));
    }

    // Get Order
    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrder(@PathVariable String orderId) {
        return ResponseEntity.ok(orderService.getOrderByOrderId(orderId));
    }

    // Get Orders by User ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getOrdersByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(orderService.getOrdersByUserId(userId));
    }

    // Update Order
    @PutMapping("/{orderId}")
    public ResponseEntity<Order> updateOrder(
            @PathVariable String orderId,
            @RequestBody Order order) {
        return ResponseEntity.ok(orderService.updateOrder(orderId, order));
    }

    // Cancel Order
    @DeleteMapping("/{orderId}")
    public ResponseEntity<String> cancelOrder(@PathVariable String orderId) {
        orderService.cancelOrder(orderId);
        return ResponseEntity.ok("Order cancelled successfully");
    }

    // Track Order
    @GetMapping("/{orderId}/track")
    public ResponseEntity<Order> trackOrder(@PathVariable String orderId) {
        return ResponseEntity.ok(orderService.trackOrder(orderId));
    }

    // Create order from external service (for checkout) - legacy endpoint
    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody Map<String, Object> orderData) {
        return ResponseEntity.ok(orderService.createOrderFromMap(orderData));
    }
}

