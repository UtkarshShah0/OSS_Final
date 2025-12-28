package com.user_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Map;

@FeignClient(name="order-management-service")
public interface OrderClient {
    @GetMapping("/api/orders/user/{userId}")
    List<Map<String, Object>> orders(@PathVariable Long userId);
}
