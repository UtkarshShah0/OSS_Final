package com.user_service.model;

import jakarta.persistence.*;

@Entity
@Table(name="users")
public class User {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY) private Long id;
        @Column(unique=true) private String email;
        @Column(unique=true) private String phone;
        @Column(nullable=false) private String passwordHash;
        private Boolean mfaEnabled = false;

        public User() {}

        public User(Long id, String email, String phone, String passwordHash, Boolean mfaEnabled) {
            this.id = id;
            this.email = email;
            this.phone = phone;
            this.passwordHash = passwordHash;
            this.mfaEnabled = mfaEnabled;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }

        public String getPasswordHash() { return passwordHash; }
        public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

        public Boolean getMfaEnabled() { return mfaEnabled; }
        public void setMfaEnabled(Boolean mfaEnabled) { this.mfaEnabled = mfaEnabled; }
    }


