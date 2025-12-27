package com.user_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Map;

@FeignClient(name="order-service")
public interface OrderClient {
    @GetMapping("/orders/user/{userId}")
    List<Map<String, Object>> orders(@PathVariable Long userId);
}
