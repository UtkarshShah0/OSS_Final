package com.user_service.model;

import jakarta.persistence.*;

@Entity
@Table(name="payment_methods")
public class PaymentMethod {
    
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY) 
    private Long id;
    
    @Column(nullable=false) 
    private Long userId;
    
    @Column(nullable=false) 
    private String provider; // "VISA", "MASTERCARD", "UPI", "PAYTM", etc.
    
    @Column(nullable=false) 
    private String token;    // tokenized reference only (secure)
    
    @Column(name="is_default")
    private Boolean isDefault = false;
    
    // Additional fields for better UX (optional, for display purposes)
    @Column(name="display_name")
    private String displayName; // e.g., "Visa ending in 1234"
    
    @Column(name="payment_type")
    private String paymentType; // "card", "upi", "cod", "bnpl"

    public PaymentMethod() {}

    public PaymentMethod(Long id, Long userId, String provider, String token) {
        this.id = id;
        this.userId = userId;
        this.provider = provider;
        this.token = token;
        this.isDefault = false;
    }

    public PaymentMethod(Long id, Long userId, String provider, String token, Boolean isDefault, String displayName, String paymentType) {
        this.id = id;
        this.userId = userId;
        this.provider = provider;
        this.token = token;
        this.isDefault = isDefault;
        this.displayName = displayName;
        this.paymentType = paymentType;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public Boolean getIsDefault() { return isDefault; }
    public void setIsDefault(Boolean isDefault) { this.isDefault = isDefault; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public String getPaymentType() { return paymentType; }
    public void setPaymentType(String paymentType) { this.paymentType = paymentType; }
}
