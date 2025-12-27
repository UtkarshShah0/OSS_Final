package com.tcs.boot.service;


public interface EmailService {

    void sendOrderPlacedEmail(String toEmail, String orderId);

    void sendOrderCancelledEmail(String toEmail, String orderId);
}
