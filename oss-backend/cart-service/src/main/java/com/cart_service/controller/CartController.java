package com.cart_service.controller;

import com.cart_service.dto.PriceDto;
import com.cart_service.model.Cart;
import com.cart_service.service.CartService;
import com.cart_service.service.PricingService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
public class CartController {

        private final CartService svc;
        private final PricingService pricing;

        public CartController(CartService svc, PricingService pricing) {
            this.svc = svc;
            this.pricing = pricing;
        }

        @GetMapping("/{userId}") public Cart get(@PathVariable Long userId){ return svc.getOrCreate(userId); }
        @PostMapping("/{userId}/items") public Cart add(@PathVariable Long userId, @RequestParam Long productId, @RequestParam Integer quantity, @RequestParam(required=false) String variant){ return svc.add(userId, productId, quantity, variant); }
        @PutMapping("/{userId}/items/{itemId}") public Cart update(@PathVariable Long userId, @PathVariable Long itemId, @RequestParam Integer quantity){ return svc.update(userId, itemId, quantity); }
        @DeleteMapping("/{userId}/items/{itemId}") public Cart remove(@PathVariable Long userId, @PathVariable Long itemId){ return svc.remove(userId, itemId); }
        @GetMapping("/{userId}/price") public PriceDto price(@PathVariable Long userId){ return pricing.price(svc.getOrCreate(userId)); }
    }


