package com.user_service.controller;

import com.user_service.dto.LoginRequest;
import com.user_service.dto.RegisterRequest;
import com.user_service.dto.OtpRequest;
import com.user_service.dto.OtpVerifyRequest;
import com.user_service.dto.SetPasswordRequest;
import com.user_service.model.User;
import com.user_service.service.AuthService;
import com.user_service.service.OtpService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService auth;
    private final OtpService otp;

    public AuthController(AuthService auth, OtpService otp) {
        this.auth = auth;
        this.otp = otp;
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterRequest request) {
        try {
            User user = auth.register(request.getEmail(), request.getPhone(), request.getPassword());
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/register/stub")
    public ResponseEntity<User> registerStub(@RequestBody RegisterRequest request) {
        try {
            System.out.println("Received registerStub request: email=" + request.getEmail() + ", phone=" + request.getPhone());
            User user = auth.registerStub(request.getEmail(), request.getPhone());
            System.out.println("Successfully created user with ID: " + user.getId());
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            System.err.println("Error in registerStub: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody LoginRequest request) {
        try {
            User user = auth.login(request.getEmailOrPhone(), request.getPassword());
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/mfa/send")
    public ResponseEntity<?> sendOtp(@RequestBody OtpRequest request) {
        try {
            System.out.println("Received OTP send request for userId: " + request.getUserId() + ", email: " + request.getEmail());
            otp.sendOtp(request.getUserId(), request.getEmail());
            System.out.println("OTP sent successfully");
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.err.println("Error sending OTP: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to send OTP: " + e.getMessage());
        }
    }

    @PostMapping("/mfa/verify")
    public ResponseEntity<?> verify(@RequestBody OtpVerifyRequest request) {
        try {
            boolean isValid = otp.verifyOtp(request.getUserId(), request.getEmail(), request.getOtpCode());
            return isValid ? ResponseEntity.ok().build() : ResponseEntity.badRequest().body("Invalid OTP");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("OTP verification failed");
        }
    }

    @PostMapping("/password/reset")
    public ResponseEntity<?> pwdReset(@RequestBody RegisterRequest request) {
        // stub: send reset link
        return ResponseEntity.ok().build();
    }

    @PostMapping("/set-password")
    public ResponseEntity<?> setPassword(@RequestBody SetPasswordRequest request) {
        try {
            System.out.println("Setting password for userId: " + request.getUserId());
            auth.setUserPassword(request.getUserId(), request.getPassword());
            System.out.println("Password set successfully");
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.err.println("Error setting password: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to set password: " + e.getMessage());
        }
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Auth controller is working!");
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getUserDetails(@PathVariable Long userId) {
        try {
            User user = auth.getUserById(userId);
            Map<String, Object> userDetails = new HashMap<>();
            userDetails.put("id", user.getId());
            userDetails.put("email", user.getEmail());
            userDetails.put("phone", user.getPhone());
            userDetails.put("mfaEnabled", user.getMfaEnabled());
            return ResponseEntity.ok(userDetails);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}


