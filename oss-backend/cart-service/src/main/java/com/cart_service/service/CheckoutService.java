package com.cart_service.service;

import com.cart_service.client.OrderClient;
import com.cart_service.client.PaymentClient;
import com.cart_service.dto.PriceDto;
import com.cart_service.model.Cart;
import com.cart_service.repository.CartRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CheckoutService {


    private final CartService carts;
    private final PricingService pricing;
    private final OrderClient orders;
    private final PaymentClient payments;
    private final CartRepository cartRepo;

    public CheckoutService(CartService carts, PricingService pricing, OrderClient orders, PaymentClient payments, CartRepository cartRepo) {
        this.carts = carts;
        this.pricing = pricing;
        this.orders = orders;
        this.payments = payments;
        this.cartRepo = cartRepo;
    }

    public Map<String,Object> checkout(Long userId, Long addressId, String shipping, String paymentMethod){
            Cart cart = carts.getOrCreate(userId);
            PriceDto price = pricing.price(cart);
            Map<String,Object> orderPayload = new HashMap<>(); 
            orderPayload.put("userId", userId); 
            orderPayload.put("addressId", addressId); 
            orderPayload.put("shippingOption", shipping); 
            orderPayload.put("amount", price.getGrandTotal());
            
            List<Map<String,Object>> items = new ArrayList<>(); 
            
            // Calculate unit price using BigDecimal arithmetic
            java.math.BigDecimal grandTotal = price.getGrandTotal();
            int itemCount = cart.getItems().size();
            java.math.BigDecimal unitPrice = itemCount > 0 ? 
                grandTotal.divide(java.math.BigDecimal.valueOf(itemCount), 2, java.math.RoundingMode.HALF_UP) : 
                java.math.BigDecimal.ZERO;
            
            cart.getItems().forEach(ci -> {
                java.math.BigDecimal lineTotal = unitPrice.multiply(java.math.BigDecimal.valueOf(ci.getQuantity()));
                items.add(Map.of(
                    "productId", ci.getProductId(), 
                    "name", "Product-" + ci.getProductId(), 
                    "quantity", ci.getQuantity(), 
                    "unitPrice", unitPrice.doubleValue(), 
                    "lineTotal", lineTotal.doubleValue()
                ));
            }); 
            orderPayload.put("items", items);
            
            Map<String,Object> orderResp = orders.create(orderPayload);
            Map<String,Object> intent = payments.createIntent(Map.of(
                "orderId", orderResp.get("orderId"), 
                "userId", userId, 
                "amount", price.getGrandTotal(), 
                "method", paymentMethod
            ));
            Map<String,Object> confirm = payments.confirm(Map.of("intentId", intent.get("id")));
            
            // Clear cart after successful checkout
            cart.getItems().clear();
            cartRepo.save(cart);
            
            return Map.of("order", orderResp, "payment", confirm, "message", "Order placed successfully!");
        }
    }


