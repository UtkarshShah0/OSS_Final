package com.user_service.controller;

import com.user_service.client.OrderClient;
import com.user_service.model.Address;
import com.user_service.model.PaymentMethod;
import com.user_service.model.Profile;
import com.user_service.model.WishlistItem;
import com.user_service.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    private final ProfileService svc;
    private final OrderClient orders;

    public UserController(ProfileService svc, OrderClient orders) {
        this.svc = svc;
        this.orders = orders;
    }
        @PutMapping("/{userId}/profile")
        public ResponseEntity<Profile> updateProfile(@PathVariable Long userId,
                                                     @RequestBody Map<String,String> body){
            return ResponseEntity.ok(svc.upsertProfile(userId, body.get("fullName"),
                    body.get("avatarUrl")));
        }
        @GetMapping("/{userId}/addresses")
        public List<Address> listAddr(@PathVariable Long userId){
            return svc.addresses(userId);

        }
        @PostMapping("/{userId}/addresses")
        public Address addAddr(@PathVariable Long userId, @RequestBody Address a){
            return svc.addAddress(userId, a);
        }
        @DeleteMapping("/{userId}/addresses/{id}")
        public ResponseEntity<?> delAddr(@PathVariable Long userId, @PathVariable Long id){
            svc.deleteAddress(userId, id);
            return ResponseEntity.ok().build();
        }
        @GetMapping("/{userId}/payments")
        public List<PaymentMethod> listPay(@PathVariable Long userId){
            return svc.payments(userId);
        }
        @PostMapping("/{userId}/payments")
        public PaymentMethod addPay(@PathVariable Long userId, @RequestBody Map<String,String> body){
            return svc.addPayment(userId, body.get("provider"),
                    body.get("token"));
        }
        @GetMapping("/{userId}/wishlist")
        public List<WishlistItem> listWish(@PathVariable Long userId){
            return svc.wishlist(userId);
        }
        @PostMapping("/{userId}/wishlist")
        public WishlistItem addWish(@PathVariable Long userId,
                                    @RequestBody Map<String,Long> body){
            return svc.addWishlist(userId, body.get("productId"));
        }
        @DeleteMapping("/{userId}/wishlist/{productId}")
        public ResponseEntity<?> delWish(@PathVariable Long userId,
                                         @PathVariable Long productId){
            svc.removeWishlist(userId, productId); return ResponseEntity.ok().build();
        }
        @GetMapping("/{userId}/orders")
        public ResponseEntity<List<Map<String,Object>>> history(@PathVariable Long userId){
            return ResponseEntity.ok(orders.orders(userId));
        }
    }


