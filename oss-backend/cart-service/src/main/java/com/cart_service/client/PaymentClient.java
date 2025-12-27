package com.cart_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;
@FeignClient(name="payment-service")
public interface PaymentClient {

    @PostMapping("/payments/intents")
    Map<String,Object> createIntent(@RequestBody Map<String,Object> payload);
    @PostMapping("/payments/confirm")
    Map<String,Object> confirm(@RequestBody Map<String,Object> payload);
}
