package com.oss.productcatalog.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProductRequest {

    @NotBlank private String sku;
    @NotBlank private String name;
    @NotBlank private String brand;
    @NotNull private BigDecimal price;
    @NotNull private Integer stock;

    private String description;
    private Map<String, String> specifications;
    private List<Long> categoryIds;
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
	public Integer getStock() {
		return stock;
	}
	public void setStock(Integer stock) {
		this.stock = stock;
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
	public List<Long> getCategoryIds() {
		return categoryIds;
	}
	public void setCategoryIds(List<Long> categoryIds) {
		this.categoryIds = categoryIds;
	}
}
