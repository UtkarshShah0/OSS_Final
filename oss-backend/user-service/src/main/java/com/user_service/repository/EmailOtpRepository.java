package com.user_service.repository;

import com.user_service.model.EmailOtp;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmailOtpRepository extends JpaRepository<EmailOtp, Long> {
        Optional<EmailOtp> findTopByUserIdAndEmailOrderByExpiresAtDesc(Long userId, String email);
    }


