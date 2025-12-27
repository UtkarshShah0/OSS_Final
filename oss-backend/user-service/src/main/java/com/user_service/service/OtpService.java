package com.user_service.service;

import com.user_service.model.EmailOtp;
import com.user_service.repository.EmailOtpRepository;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Random;

@Service
public class OtpService {

    private final EmailOtpRepository repo;
    private final JavaMailSender mail;

    public OtpService(EmailOtpRepository repo, JavaMailSender mail) {
        this.repo = repo;
        this.mail = mail;
    }
        public void sendOtp(Long userId, String email){
            String otp = String.valueOf(100000 + new Random().nextInt(900000));
            EmailOtp e = new EmailOtp(); e.setUserId(userId); e.setEmail(email); e.setOtp(otp); e.setExpiresAt(Instant.now().plusSeconds(300)); repo.save(e);
            SimpleMailMessage msg = new SimpleMailMessage(); msg.setTo(email); msg.setSubject("Your OTP Code"); msg.setText("Your OTP is: " + otp + " (valid 5 min)"); mail.send(msg);
        }
        public boolean verifyOtp(Long userId, String email, String otp){
            EmailOtp e = repo.findTopByUserIdAndEmailOrderByExpiresAtDesc(userId, email).orElseThrow(() -> new IllegalArgumentException("OTP not found"));
            if (Instant.now().isAfter(e.getExpiresAt())) throw new IllegalArgumentException("OTP expired");
            return e.getOtp().equals(otp);
        }
    }


