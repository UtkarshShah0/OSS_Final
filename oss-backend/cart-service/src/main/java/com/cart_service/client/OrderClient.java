package com.cart_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

@FeignClient(name="order-service")
public interface OrderClient {
    @PostMapping("/orders")
    Map<String,Object> create(@RequestBody Map<String,Object> payload);
}
