package com.user_service.repository;

import com.user_service.model.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, Long> {
        List<PaymentMethod> findByUserId(Long userId);
    }


