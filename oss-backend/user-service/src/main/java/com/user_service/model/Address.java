package com.user_service.model;

import jakarta.persistence.*;

@Entity
@Table(name="addresses")
public class Address {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY) 
    private Long id;
    
    @Column(nullable=false) 
    private Long userId;
    
    // Keep original fields for backward compatibility
    @Column(nullable=false, name="line1") 
    private String line1;
    
    @Column(name="line2")
    private String line2;
    
    @Column(nullable=false)
    private String city;
    
    @Column(nullable=false)
    private String state;
    
    @Column(name="postal_code", nullable=false)
    private String postalCode;
    
    @Column(nullable=false)
    private String country;
    
    // New fields (optional to avoid breaking existing data)
    @Column(name="full_name")
    private String fullName;
    
    @Column(name="phone")
    private String phone;
    
    @Column(name="is_default")
    private Boolean isDefault = false;

    public Address() {}

    // Getters and Setters
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

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Boolean getIsDefault() { return isDefault; }
    public void setIsDefault(Boolean isDefault) { this.isDefault = isDefault; }

    // Frontend compatibility methods
    public String getAddressLine1() { return line1; }
    public void setAddressLine1(String addressLine1) { this.line1 = addressLine1; }

    public String getAddressLine2() { return line2; }
    public void setAddressLine2(String addressLine2) { this.line2 = addressLine2; }

    public String getZipCode() { return postalCode; }
    public void setZipCode(String zipCode) { this.postalCode = zipCode; }

    @Override
    public String toString() {
        return "Address{" +
                "id=" + id +
                ", userId=" + userId +
                ", fullName='" + fullName + '\'' +
                ", phone='" + phone + '\'' +
                ", line1='" + line1 + '\'' +
                ", line2='" + line2 + '\'' +
                ", city='" + city + '\'' +
                ", state='" + state + '\'' +
                ", postalCode='" + postalCode + '\'' +
                ", country='" + country + '\'' +
                ", isDefault=" + isDefault +
                '}';
    }
}
