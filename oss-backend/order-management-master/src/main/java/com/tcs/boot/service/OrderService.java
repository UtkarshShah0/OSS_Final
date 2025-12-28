package com.tcs.boot.service;

import com.tcs.boot.entity.Order;

import java.util.List;
import java.util.Map;

public interface OrderService {

    Order placeOrder(Order order);

    Order getOrderByOrderId(String orderId);

    List<Order> getOrdersByUserId(Long userId);

    Order updateOrder(String orderId, Order updatedOrder);

    void cancelOrder(String orderId);

    Order trackOrder(String orderId);

    Map<String, Object> createOrderFromMap(Map<String, Object> orderData);
    
    Order createOrderFromFrontend(Map<String, Object> orderData);
}