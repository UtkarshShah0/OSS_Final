package com.user_service.controller;

import com.user_service.model.User;
import com.user_service.service.AuthService;
import com.user_service.service.OtpService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService auth;
    private final OtpService otp;

    public AuthController(AuthService auth, OtpService otp) {
        this.auth = auth;
        this.otp = otp;
    }
        @PostMapping("/register") public ResponseEntity<User> register(@RequestParam(required=false) String email, @RequestParam(required=false) String phone, @RequestParam String password){ return ResponseEntity.ok(auth.register(email, phone, password)); }
        @PostMapping("/login") public ResponseEntity<User> login(@RequestParam String emailOrPhone, @RequestParam String password){ return ResponseEntity.ok(auth.login(emailOrPhone, password)); }
        @PostMapping("/mfa/send") public ResponseEntity<?> sendOtp(@RequestParam Long userId, @RequestParam String email){ otp.sendOtp(userId, email); return ResponseEntity.ok().build(); }
        @PostMapping("/mfa/verify") public ResponseEntity<?> verify(@RequestParam Long userId, @RequestParam String email, @RequestParam String otpCode){
            return otp.verifyOtp(userId, email, otpCode) ? ResponseEntity.ok().build() : ResponseEntity.badRequest().body("Invalid OTP");
        }
        @PostMapping("/password/reset") public ResponseEntity<?> pwdReset(@RequestParam String email){ /* stub: send reset link */ return ResponseEntity.ok().build(); }
    }


