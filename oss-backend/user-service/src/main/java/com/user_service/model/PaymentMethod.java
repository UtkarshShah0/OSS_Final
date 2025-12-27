package com.user_service.model;

import jakarta.persistence.*;

@Entity
@Table(name="payment_methods")
public class PaymentMethod {
    

        @Id
        @GeneratedValue(strategy= GenerationType.IDENTITY) private Long id;
        @Column(nullable=false) private Long userId;
        @Column(nullable=false) private String provider; // "VISA","UPI","PAYTM"
        @Column(nullable=false) private String token;    // tokenized reference only

        public PaymentMethod() {}

        public PaymentMethod(Long id, Long userId, String provider, String token) {
            this.id = id;
            this.userId = userId;
            this.provider = provider;
            this.token = token;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }

        public String getProvider() { return provider; }
        public void setProvider(String provider) { this.provider = provider; }

        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }

}
