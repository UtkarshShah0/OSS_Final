package com.cart_service.service;

import com.cart_service.client.ProductClient;
import com.cart_service.dto.PriceDto;
import com.cart_service.dto.ProductDto;
import com.cart_service.model.Cart;
import com.cart_service.model.CartItem;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PricingService {

    private final ProductClient products;

    public PricingService(ProductClient products) {
        this.products = products;
    }

    public PriceDto price(Cart cart){
            List<Long> ids = cart.getItems().stream().map(CartItem::getProductId).distinct().toList();
            Map<Long, ProductDto> map = products.batch(ids).stream().collect(Collectors.toMap(ProductDto::getId, p->p));
            BigDecimal subtotal = BigDecimal.ZERO;
            for (CartItem i : cart.getItems()){
                ProductDto p = map.get(i.getProductId());
                BigDecimal line = p.getPrice().multiply(BigDecimal.valueOf(i.getQuantity()));
                subtotal = subtotal.add(line);
            }
            PriceDto dto = new PriceDto(); dto.setSubtotal(subtotal); dto.setGrandTotal(subtotal); return dto;
        }
    }


