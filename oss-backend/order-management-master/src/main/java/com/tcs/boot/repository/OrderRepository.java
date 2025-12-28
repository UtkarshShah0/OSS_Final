package com.tcs.boot.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tcs.boot.entity.Order;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByOrderId(String orderId);
    
    List<Order> findByCustomerId(Long customerId);
}
