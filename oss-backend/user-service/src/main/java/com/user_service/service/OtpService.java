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
        try {
            System.out.println("Generating OTP for userId: " + userId + ", email: " + email);
            String otp = String.valueOf(100000 + new Random().nextInt(900000));
            
            EmailOtp e = new EmailOtp(); 
            e.setUserId(userId); 
            e.setEmail(email); 
            e.setOtp(otp); 
            e.setExpiresAt(Instant.now().plusSeconds(300)); 
            repo.save(e);
            System.out.println("OTP saved to database: " + otp);
            
            SimpleMailMessage msg = new SimpleMailMessage(); 
            msg.setTo(email); 
            msg.setSubject("Your OTP Code"); 
            msg.setText("Your OTP is: " + otp + " (valid 5 min)"); 
            
            System.out.println("Attempting to send email to: " + email);
            mail.send(msg);
            System.out.println("Email sent successfully!");
            
        } catch (Exception ex) {
            System.err.println("ERROR sending OTP email: " + ex.getMessage());
            ex.printStackTrace();
            throw new RuntimeException("Failed to send OTP email", ex);
        }
    }
    
    public boolean verifyOtp(Long userId, String email, String otp){
        try {
            System.out.println("Verifying OTP for userId: " + userId + ", email: " + email + ", otp: " + otp);
            EmailOtp e = repo.findTopByUserIdAndEmailOrderByExpiresAtDesc(userId, email)
                .orElseThrow(() -> new IllegalArgumentException("OTP not found"));
            
            if (Instant.now().isAfter(e.getExpiresAt())) {
                System.out.println("OTP expired");
                throw new IllegalArgumentException("OTP expired");
            }
            
            boolean isValid = e.getOtp().equals(otp);
            System.out.println("OTP verification result: " + isValid);
            return isValid;
            
        } catch (Exception ex) {
            System.err.println("ERROR verifying OTP: " + ex.getMessage());
            throw ex;
        }
    }
}


