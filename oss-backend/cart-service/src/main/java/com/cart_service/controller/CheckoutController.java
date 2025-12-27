package com.cart_service.controller;

import com.cart_service.service.CheckoutService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/checkout")
public class CheckoutController {

        private final CheckoutService svc;

        public CheckoutController(CheckoutService svc) {
            this.svc = svc;
        }

        @PostMapping
        public ResponseEntity<Map<String,Object>> checkout(@RequestParam Long userId, @RequestParam Long addressId, @RequestParam(defaultValue="STANDARD") String shipping, @RequestParam String method){
            return ResponseEntity.ok(svc.checkout(userId, addressId, shipping, method));
        }
    }


