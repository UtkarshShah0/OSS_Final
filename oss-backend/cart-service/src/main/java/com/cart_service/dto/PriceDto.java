package com.cart_service.dto;

import java.math.BigDecimal;

public class PriceDto {


  private BigDecimal subtotal;
  private BigDecimal grandTotal;

    public PriceDto() {}

    public PriceDto(BigDecimal subtotal, BigDecimal grandTotal) {
        this.subtotal = subtotal;
        this.grandTotal = grandTotal;
    }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public BigDecimal getGrandTotal() { return grandTotal; }
    public void setGrandTotal(BigDecimal grandTotal) { this.grandTotal = grandTotal; }


}


