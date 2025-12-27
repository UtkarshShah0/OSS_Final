package com.user_service.model;

import jakarta.persistence.*;

@Entity
@Table(name="wishlist")
public class WishlistItem {

        @Id
        @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
        @Column(nullable=false) private Long userId;
        @Column(nullable=false) private Long productId;

        public WishlistItem() {}

        public WishlistItem(Long id, Long userId, Long productId) {
            this.id = id;
            this.userId = userId;
            this.productId = productId;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }

}
