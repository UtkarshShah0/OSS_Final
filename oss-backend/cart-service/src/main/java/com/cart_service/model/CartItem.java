package com.cart_service.model;

import jakarta.persistence.*;

@Entity
@Table(name="cart_items")
public class CartItem {

        @Id
        @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
        @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="cart_id") private Cart cart;
        @Column(nullable=false) private Long productId;
        @Column(nullable=false) private Integer quantity;
        private String variant;

        public CartItem() {}

        public CartItem(Long id, Cart cart, Long productId, Integer quantity, String variant) {
            this.id = id;
            this.cart = cart;
            this.productId = productId;
            this.quantity = quantity;
            this.variant = variant;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public Cart getCart() { return cart; }
        public void setCart(Cart cart) { this.cart = cart; }

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }

        public String getVariant() { return variant; }
        public void setVariant(String variant) { this.variant = variant; }
    }


