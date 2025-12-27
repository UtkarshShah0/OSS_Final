package com.tcs.boot.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tcs.boot.entity.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long>{

}
