package com.cart_service.client;

import com.cart_service.dto.ProductDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
@FeignClient(name="product-service")
public interface ProductClient {

    @GetMapping("/products/{id}")
    ProductDto get(@PathVariable Long id);
    @PostMapping("/products/batch")
    List<ProductDto> batch(@RequestBody List<Long> ids);
}
