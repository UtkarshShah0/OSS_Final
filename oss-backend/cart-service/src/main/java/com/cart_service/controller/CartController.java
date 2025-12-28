package com.cart_service.controller;

import com.cart_service.dto.CartDto;
import com.cart_service.dto.CartItemDto;
import com.cart_service.dto.PriceDto;
import com.cart_service.model.Cart;
import com.cart_service.service.CartService;
import com.cart_service.service.PricingService;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/cart")
public class CartController {

        private final CartService svc;
        private final PricingService pricing;

        public CartController(CartService svc, PricingService pricing) {
            this.svc = svc;
            this.pricing = pricing;
        }

        @GetMapping("/{userId}") 
        public CartDto get(@PathVariable Long userId){ 
            Cart cart = svc.getOrCreate(userId);
            return convertToDto(cart);
        }
        
        @PostMapping("/{userId}/items") 
        public CartDto add(@PathVariable Long userId, @RequestParam Long productId, @RequestParam Integer quantity, @RequestParam(required=false) String variant){ 
            Cart cart = svc.add(userId, productId, quantity, variant);
            return convertToDto(cart);
        }
        
        @PutMapping("/{userId}/items/{itemId}") 
        public CartDto update(@PathVariable Long userId, @PathVariable Long itemId, @RequestParam Integer quantity){ 
            Cart cart = svc.update(userId, itemId, quantity);
            return convertToDto(cart);
        }
        
        @DeleteMapping("/{userId}/items/{itemId}") 
        public CartDto remove(@PathVariable Long userId, @PathVariable Long itemId){ 
            Cart cart = svc.remove(userId, itemId);
            return convertToDto(cart);
        }
        
        @GetMapping("/{userId}/price") 
        public PriceDto price(@PathVariable Long userId){ 
            return pricing.price(svc.getOrCreate(userId)); 
        }

        private CartDto convertToDto(Cart cart) {
            return new CartDto(
                cart.getId(),
                cart.getUserId(),
                cart.getItems().stream()
                    .map(item -> new CartItemDto(
                        item.getId(),
                        item.getProductId(),
                        item.getQuantity(),
                        item.getVariant()
                    ))
                    .collect(Collectors.toList()),
                cart.getUpdatedAt()
            );
        }
    }


