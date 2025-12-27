package com.user_service.model;

import jakarta.persistence.*;

@Entity
@Table(name="addresses")
public class Address {


        @Id
        @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
        @Column(nullable=false) private Long userId;
        @Column(nullable=false) private String line1;
        private String line2, city, state, postalCode, country;

        public Address() {}

        public Address(Long id, Long userId, String line1, String line2, String city, String state, String postalCode, String country) {
            this.id = id;
            this.userId = userId;
            this.line1 = line1;
            this.line2 = line2;
            this.city = city;
            this.state = state;
            this.postalCode = postalCode;
            this.country = country;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }

        public String getLine1() { return line1; }
        public void setLine1(String line1) { this.line1 = line1; }

        public String getLine2() { return line2; }
        public void setLine2(String line2) { this.line2 = line2; }

        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }

        public String getState() { return state; }
        public void setState(String state) { this.state = state; }

        public String getPostalCode() { return postalCode; }
        public void setPostalCode(String postalCode) { this.postalCode = postalCode; }

        public String getCountry() { return country; }
        public void setCountry(String country) { this.country = country; }

}
