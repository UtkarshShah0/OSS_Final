package com.tcs.boot.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.tcs.boot.entity.Order;
import com.tcs.boot.entity.OrderItem;

import java.text.NumberFormat;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

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
    public void sendDetailedOrderPlacedEmail(Order order) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(order.getCustomerEmail());
        message.setSubject("Order Confirmation - " + order.getOrderId());
        
        StringBuilder emailBody = new StringBuilder();
        NumberFormat currencyFormat = NumberFormat.getCurrencyInstance(new Locale("en", "IN"));
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");
        
        // Email Header
        emailBody.append("Dear Customer,\n\n");
        emailBody.append("Thank you for your order! We're excited to confirm that your order has been placed successfully.\n\n");
        
        // Order Details
        emailBody.append("=== ORDER DETAILS ===\n");
        emailBody.append("Order ID: ").append(order.getOrderId()).append("\n");
        emailBody.append("Order Date: ").append(order.getOrderDate().format(dateFormatter)).append("\n");
        emailBody.append("Status: ").append(order.getStatus()).append("\n");
        emailBody.append("Estimated Delivery: ").append(order.getEstimatedDelivery().format(dateFormatter)).append("\n\n");
        
        // Items Details
        emailBody.append("=== ITEMS ORDERED ===\n");
        for (OrderItem item : order.getItems()) {
            emailBody.append("• ").append(item.getProductName() != null ? item.getProductName() : "Product ID: " + item.getProductId()).append("\n");
            emailBody.append("  Quantity: ").append(item.getQuantity()).append("\n");
            emailBody.append("  Price: ").append(currencyFormat.format(item.getPrice())).append(" each\n");
            emailBody.append("  Total: ").append(currencyFormat.format(item.getTotal() != null ? item.getTotal() : item.getPrice() * item.getQuantity())).append("\n\n");
        }
        
        // Price Breakdown
        emailBody.append("=== PRICE BREAKDOWN ===\n");
        if (order.getSubtotal() != null) {
            emailBody.append("Subtotal: ").append(currencyFormat.format(order.getSubtotal())).append("\n");
        }
        if (order.getShipping() != null) {
            emailBody.append("Shipping: ").append(currencyFormat.format(order.getShipping())).append("\n");
        }
        if (order.getTax() != null) {
            emailBody.append("Tax (GST): ").append(currencyFormat.format(order.getTax())).append("\n");
        }
        if (order.getDiscount() != null && order.getDiscount() > 0) {
            emailBody.append("Discount: -").append(currencyFormat.format(order.getDiscount())).append("\n");
        }
        emailBody.append("TOTAL: ").append(currencyFormat.format(order.getTotalAmount())).append("\n\n");
        
        // Shipping Address
        if (order.getShippingFullName() != null) {
            emailBody.append("=== SHIPPING ADDRESS ===\n");
            emailBody.append(order.getShippingFullName()).append("\n");
            emailBody.append(order.getShippingPhone()).append("\n");
            emailBody.append(order.getShippingAddressLine1()).append("\n");
            if (order.getShippingAddressLine2() != null && !order.getShippingAddressLine2().isEmpty()) {
                emailBody.append(order.getShippingAddressLine2()).append("\n");
            }
            emailBody.append(order.getShippingCity()).append(", ").append(order.getShippingState()).append(" ").append(order.getShippingZipCode()).append("\n");
            emailBody.append(order.getShippingCountry()).append("\n\n");
        }
        
        // Payment Method
        if (order.getPaymentType() != null) {
            emailBody.append("=== PAYMENT METHOD ===\n");
            emailBody.append("Payment Type: ").append(order.getPaymentType().toUpperCase()).append("\n");
            if (order.getPaymentDetails() != null) {
                emailBody.append("Payment Details: ").append(order.getPaymentDetails()).append("\n");
            }
            if (order.getPaymentProvider() != null) {
                emailBody.append("Provider: ").append(order.getPaymentProvider()).append("\n");
            }
            emailBody.append("\n");
        }
        
        // Footer
        emailBody.append("=== WHAT'S NEXT? ===\n");
        emailBody.append("• You will receive a shipping confirmation email once your order is dispatched\n");
        emailBody.append("• Track your order status in your account dashboard\n");
        emailBody.append("• Contact our support team if you have any questions\n\n");
        
        emailBody.append("Thank you for choosing us!\n\n");
        emailBody.append("Best regards,\n");
        emailBody.append("The E-Commerce Team\n");
        emailBody.append("legendary.life11@gmail.com");
        
        message.setText(emailBody.toString());
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

