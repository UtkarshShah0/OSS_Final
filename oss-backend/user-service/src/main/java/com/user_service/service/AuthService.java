package com.user_service.service;

import com.user_service.model.User;
import com.user_service.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository repo;
    private final BCryptPasswordEncoder encoder;

    public AuthService(UserRepository repo, BCryptPasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    public User register(String email, String phone, String password){
        if ((email==null||email.isBlank()) && (phone==null||phone.isBlank())) 
            throw new IllegalArgumentException("Email or phone required");
        User u = new User(); 
        u.setEmail(email); 
        u.setPhone(phone); 
        u.setPasswordHash(encoder.encode(password)); 
        return repo.save(u);
    }

    // Create a user "stub" without requiring a user-provided password.
    // Stores a random password hash so DB non-null constraint is satisfied.
    public User registerStub(String email, String phone){
        if ((email==null||email.isBlank()) && (phone==null||phone.isBlank())) 
            throw new IllegalArgumentException("Email or phone required");
        // generate a random password and store its hash so the passwordHash column is not null
        String randomPwd = java.util.UUID.randomUUID().toString();
        User u = new User();
        u.setEmail(email);
        u.setPhone(phone);
        u.setPasswordHash(encoder.encode(randomPwd));
        return repo.save(u);
    }

    public User login(String emailOrPhone, String password){
        Optional<User> opt = emailOrPhone.contains("@") ? 
            repo.findByEmail(emailOrPhone) : repo.findByPhone(emailOrPhone);
        User u = opt.orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (!encoder.matches(password, u.getPasswordHash())) 
            throw new IllegalArgumentException("Invalid credentials");
        return u;
    }

    public void setUserPassword(Long userId, String password) {
        User user = repo.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setPasswordHash(encoder.encode(password));
        repo.save(user);
    }

    public User getUserById(Long userId) {
        return repo.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}


