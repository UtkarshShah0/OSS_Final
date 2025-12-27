package com.tcs.boot.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendOrderPlacedEmail(String toEmail, String orderId) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Order Placed Successfully - " + orderId);
        message.setText(
                "Dear Customer,\n\n" +
                "Your order has been placed successfully.\n\n" +
                "Order ID: " + orderId + "\n\n" +
                "Thank you for shopping with us!\n\n" +
                "Regards,\nOrder Management Team"
        );

        mailSender.send(message);
    }

    @Override
    public void sendOrderCancelledEmail(String toEmail, String orderId) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Order Cancelled - " + orderId);
        message.setText(
                "Dear Customer,\n\n" +
                "Your order has been cancelled successfully.\n\n" +
                "Order ID: " + orderId + "\n\n" +
                "If you have already paid, the refund will be processed as per policy.\n\n" +
                "Regards,\nOrder Management Team"
        );

        mailSender.send(message);
    }
}

