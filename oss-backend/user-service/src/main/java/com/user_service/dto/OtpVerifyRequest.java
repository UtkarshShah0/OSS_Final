package com.user_service.dto;

public class OtpVerifyRequest {
    private Long userId;
    private String email;
    private String otpCode;

    public OtpVerifyRequest() {}

    public OtpVerifyRequest(Long userId, String email, String otpCode) {
        this.userId = userId;
        this.email = email;
        this.otpCode = otpCode;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getOtpCode() {
        return otpCode;
    }

    public void setOtpCode(String otpCode) {
        this.otpCode = otpCode;
    }
}