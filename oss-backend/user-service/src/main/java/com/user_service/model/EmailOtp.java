package com.user_service.model;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name="email_otps")
public class EmailOtp {



        @Id
        @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
        @Column(nullable=false) private Long userId;
        @Column(nullable=false) private String email;
        @Column(nullable=false) private String otp;
        @Column(nullable=false) private Instant expiresAt;

        public EmailOtp() {}

        public EmailOtp(Long id, Long userId, String email, String otp, Instant expiresAt) {
            this.id = id;
            this.userId = userId;
            this.email = email;
            this.otp = otp;
            this.expiresAt = expiresAt;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getOtp() { return otp; }
        public void setOtp(String otp) { this.otp = otp; }

        public Instant getExpiresAt() { return expiresAt; }
        public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }
    }


