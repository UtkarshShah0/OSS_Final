package com.cart_service.service;

import com.cart_service.client.OrderClient;
import com.cart_service.client.PaymentClient;
import com.cart_service.client.ProductClient;
import com.cart_service.dto.PriceDto;
import com.cart_service.dto.ProductDto;
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
    private final ProductClient productClient;

    public CheckoutService(CartService carts, PricingService pricing, OrderClient orders, PaymentClient payments, CartRepository cartRepo, ProductClient productClient) {
        this.carts = carts;
        this.pricing = pricing;
        this.orders = orders;
        this.payments = payments;
        this.cartRepo = cartRepo;
        this.productClient = productClient;
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
            
            // Fetch product details for all cart items
            List<Long> productIds = cart.getItems().stream()
                .map(ci -> ci.getProductId())
                .toList();
            
            List<ProductDto> products = productClient.batch(productIds);
            Map<Long, ProductDto> productMap = new HashMap<>();
            for (ProductDto product : products) {
                productMap.put(product.getId(), product);
            }
            
            cart.getItems().forEach(ci -> {
                ProductDto product = productMap.get(ci.getProductId());
                String productName = product != null ? product.getName() : "Product-" + ci.getProductId();
                java.math.BigDecimal productPrice = product != null ? product.getPrice() : java.math.BigDecimal.ZERO;
                java.math.BigDecimal lineTotal = productPrice.multiply(java.math.BigDecimal.valueOf(ci.getQuantity()));
                
                items.add(Map.of(
                    "productId", ci.getProductId(), 
                    "name", productName, 
                    "quantity", ci.getQuantity(), 
                    "unitPrice", productPrice.doubleValue(), 
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


