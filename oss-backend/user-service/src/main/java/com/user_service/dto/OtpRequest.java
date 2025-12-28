package com.user_service.dto;

public class OtpRequest {
    private Long userId;
    private String email;

    public OtpRequest() {}

    public OtpRequest(Long userId, String email) {
        this.userId = userId;
        this.email = email;
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
}