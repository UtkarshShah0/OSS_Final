package com.user_service.service;

import com.user_service.model.User;
import com.user_service.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository repo;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AuthService(UserRepository repo) {
        this.repo = repo;
    }
        public User register(String email, String phone, String password){
            if ((email==null||email.isBlank()) && (phone==null||phone.isBlank())) throw new IllegalArgumentException("Email or phone required");
            User u = new User(); u.setEmail(email); u.setPhone(phone); u.setPasswordHash(encoder.encode(password)); return repo.save(u);
        }
        public User login(String emailOrPhone, String password){
            Optional<User> opt = emailOrPhone.contains("@") ? repo.findByEmail(emailOrPhone) : repo.findByPhone(emailOrPhone);
            User u = opt.orElseThrow(() -> new IllegalArgumentException("User not found"));
            if (!encoder.matches(password, u.getPasswordHash())) throw new IllegalArgumentException("Invalid credentials");
            return u;
        }
    }


