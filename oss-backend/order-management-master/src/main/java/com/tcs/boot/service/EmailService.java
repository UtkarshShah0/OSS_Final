package com.tcs.boot.service;

import com.tcs.boot.entity.Order;

public interface EmailService {

    void sendOrderPlacedEmail(String toEmail, String orderId);

    void sendOrderCancelledEmail(String toEmail, String orderId);
    
    void sendDetailedOrderPlacedEmail(Order order);
}
