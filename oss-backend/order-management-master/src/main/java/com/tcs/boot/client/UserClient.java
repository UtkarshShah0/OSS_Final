package com.tcs.boot.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Map;

@FeignClient(name = "user-service")
public interface UserClient {
    
    @GetMapping("/users/{userId}/profile")
    Map<String, Object> getUserProfile(@PathVariable Long userId);
    
    @GetMapping("/auth/user/{userId}")
    Map<String, Object> getUserDetails(@PathVariable Long userId);
}