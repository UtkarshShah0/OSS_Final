package com.cart_service.service;

import com.cart_service.client.OrderClient;
import com.cart_service.client.PaymentClient;
import com.cart_service.dto.PriceDto;
import com.cart_service.model.Cart;
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

    public CheckoutService(CartService carts, PricingService pricing, OrderClient orders, PaymentClient payments) {
        this.carts = carts;
        this.pricing = pricing;
        this.orders = orders;
        this.payments = payments;
    }

    public Map<String,Object> checkout(Long userId, Long addressId, String shipping, String paymentMethod){
            Cart cart = carts.getOrCreate(userId);
            PriceDto price = pricing.price(cart);
            Map<String,Object> orderPayload = new HashMap<>(); orderPayload.put("userId", userId); orderPayload.put("addressId", addressId); orderPayload.put("shippingOption", shipping); orderPayload.put("amount", price.getGrandTotal());
            List<Map<String,Object>> items = new ArrayList<>(); cart.getItems().forEach(ci -> items.add(Map.of("productId", ci.getProductId(), "name", "N/A", "quantity", ci.getQuantity(), "unitPrice", "0", "lineTotal", "0"))); orderPayload.put("items", items);
            Map<String,Object> orderResp = orders.create(orderPayload);
            Map<String,Object> intent = payments.createIntent(Map.of("orderId", orderResp.get("id"), "userId", userId, "amount", price.getGrandTotal(), "method", paymentMethod));
            Map<String,Object> confirm = payments.confirm(Map.of("intentId", intent.get("id")));
            return Map.of("order", orderResp, "payment", confirm);
        }
    }


