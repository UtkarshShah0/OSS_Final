package com.cart_service.dto;

import java.time.Instant;
import java.util.List;

public class CartDto {
    private Long id;
    private Long userId;
    private List<CartItemDto> items;
    private Instant updatedAt;

    public CartDto() {}

    public CartDto(Long id, Long userId, List<CartItemDto> items, Instant updatedAt) {
        this.id = id;
        this.userId = userId;
        this.items = items;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public List<CartItemDto> getItems() { return items; }
    public void setItems(List<CartItemDto> items) { this.items = items; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}