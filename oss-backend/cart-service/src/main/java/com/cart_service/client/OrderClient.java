package com.cart_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

@FeignClient(name="order-management-service")
public interface OrderClient {
    @PostMapping("/api/orders/create")
    Map<String,Object> create(@RequestBody Map<String,Object> payload);
}
