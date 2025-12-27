package com.tcs.boot.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tcs.boot.entity.Order;
import com.tcs.boot.service.OrderService;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // Place Order
    @PostMapping("/")
    public ResponseEntity<Order> placeOrder(@RequestBody Order order) {
        return ResponseEntity.ok(orderService.placeOrder(order));
    }

    // Get Order
    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrder(@PathVariable String orderId) {
        return ResponseEntity.ok(orderService.getOrderByOrderId(orderId));
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
}

