package com.tcs.boot.service;

import com.tcs.boot.entity.Order;

public interface OrderService {

    Order placeOrder(Order order);

    Order getOrderByOrderId(String orderId);

    Order updateOrder(String orderId, Order updatedOrder);

    void cancelOrder(String orderId);

    Order trackOrder(String orderId);
}
