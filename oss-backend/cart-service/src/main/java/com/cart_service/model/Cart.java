package com.cart_service.model;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="carts")
public class Cart {

        @Id
        @GeneratedValue(strategy= GenerationType.IDENTITY) private Long id;
        @Column(nullable=false) private Long userId;
        @OneToMany(mappedBy="cart", cascade=CascadeType.ALL, orphanRemoval=true, fetch=FetchType.EAGER)
        private List<CartItem> items = new ArrayList<>();
        private Instant updatedAt = Instant.now();

        public Cart() {}

        public Cart(Long id, Long userId, List<CartItem> items, Instant updatedAt) {
            this.id = id;
            this.userId = userId;
            this.items = items == null ? new ArrayList<>() : items;
            this.updatedAt = updatedAt;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }

        public List<CartItem> getItems() { return items; }
        public void setItems(List<CartItem> items) { this.items = items; }

        public Instant getUpdatedAt() { return updatedAt; }
        public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
    }


