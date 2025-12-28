package com.tcs.boot.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "product-service")
public interface ProductClient {

    @GetMapping("/api/products/{id}")
    ResponseEntity<Object> getProduct(@PathVariable Long id);

    @PutMapping("/api/products/{id}/reduce-stock")
    ResponseEntity<String> reduceStock(@PathVariable Long id, @RequestParam Integer quantity);

    @GetMapping("/api/products/{id}/check-stock")
    ResponseEntity<Boolean> checkStockAvailability(@PathVariable Long id, @RequestParam Integer quantity);
}