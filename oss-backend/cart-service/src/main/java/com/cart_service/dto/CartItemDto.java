package com.cart_service.dto;

public class CartItemDto {
    private Long id;
    private Long productId;
    private Integer quantity;
    private String variant;

    public CartItemDto() {}

    public CartItemDto(Long id, Long productId, Integer quantity, String variant) {
        this.id = id;
        this.productId = productId;
        this.quantity = quantity;
        this.variant = variant;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public String getVariant() { return variant; }
    public void setVariant(String variant) { this.variant = variant; }
}