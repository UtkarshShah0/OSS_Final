package com.oss.productcatalog.dto;


import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.oss.productcatalog.model.AvailabilityStatus;

import lombok.Data;

@Data   // ⭐ REQUIRED
public class ProductResponse {

    private Long id;
    private String sku;
    private String name;
    private String brand;
    private String description;
    private BigDecimal price;
    private String currency;
    private Integer stock;
    private AvailabilityStatus availabilityStatus;
    private Map<String, String> specifications;
    private Set<String> categories;
    private List<String> imageUrls;
    private Double averageRating;
    private Long reviewCount;
    private List<ReviewResponse> reviews;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getSku() {
		return sku;
	}
	public void setSku(String sku) {
		this.sku = sku;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getBrand() {
		return brand;
	}
	public void setBrand(String brand) {
		this.brand = brand;
	}
	public BigDecimal getPrice() {
		return price;
	}
	public void setPrice(BigDecimal price) {
		this.price = price;
	}
	public String getCurrency() {
		return currency;
	}
	public void setCurrency(String currency) {
		this.currency = currency;
	}
	public Integer getStock() {
		return stock;
	}
	public void setStock(Integer stock) {
		this.stock = stock;
	}
	public AvailabilityStatus getAvailabilityStatus() {
		return availabilityStatus;
	}
	public void setAvailabilityStatus(AvailabilityStatus availabilityStatus) {
		this.availabilityStatus = availabilityStatus;
	}
	public Set<String> getCategories() {
		return categories;
	}
	public void setCategories(Set<String> categories) {
		this.categories = categories;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Map<String, String> getSpecifications() {
		return specifications;
	}

	public void setSpecifications(Map<String, String> specifications) {
		this.specifications = specifications;
	}

	public List<String> getImageUrls() {
		return imageUrls;
	}

	public void setImageUrls(List<String> imageUrls) {
		this.imageUrls = imageUrls;
	}

	public Double getAverageRating() {
		return averageRating;
	}

	public void setAverageRating(Double averageRating) {
		this.averageRating = averageRating;
	}

	public Long getReviewCount() {
		return reviewCount;
	}

	public void setReviewCount(Long reviewCount) {
		this.reviewCount = reviewCount;
	}

	public List<ReviewResponse> getReviews() {
		return reviews;
	}

	public void setReviews(List<ReviewResponse> reviews) {
		this.reviews = reviews;
	}
    

}
