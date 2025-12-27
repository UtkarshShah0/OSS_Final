package com.cart_service.service;

import com.cart_service.model.Cart;
import com.cart_service.model.CartItem;
import com.cart_service.repository.CartRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class CartService {

    private final CartRepository repo;

    public CartService(CartRepository repo) {
        this.repo = repo;
    }
    @Transactional
    public Cart getOrCreate(Long userId)
    { return repo.findByUserId(userId).orElseGet(() -> { Cart c=new Cart();
        c.setUserId(userId); return repo.save(c); });
    } @Transactional
    public Cart add(Long userId, Long productId, Integer qty, String variant){
        Cart cart = getOrCreate(userId);
        CartItem existing = cart.getItems().stream()
                .filter(i -> i.getProductId()
                        .equals(productId) && ((i.getVariant()==null && variant==null)
                        || (i.getVariant()!=null && i.getVariant().equals(variant))))
                .findFirst().orElse(null); if (existing==null){
                    CartItem ci=new CartItem(); ci.setCart(cart); ci.setProductId(productId);
                    ci.setQuantity(qty); ci.setVariant(variant);
                    cart.getItems().add(ci);
                } else {
                    existing.setQuantity(existing.getQuantity()+qty);
                } cart.setUpdatedAt(Instant.now());
                return repo.save(cart); }
    @Transactional
    public Cart update(Long userId, Long itemId, Integer qty){
        Cart c=getOrCreate(userId); c.getItems().stream()
                .filter(i->i.getId().equals(itemId))
                .findFirst().ifPresent(i->i.setQuantity(qty));
        c.setUpdatedAt(Instant.now()); return repo.save(c);
    }
    @Transactional
    public Cart remove(Long userId, Long itemId){
        Cart c=getOrCreate(userId); c.getItems()
                .removeIf(i->i.getId().equals(itemId));
        c.setUpdatedAt(Instant.now()); return repo.save(c);
    }
}
