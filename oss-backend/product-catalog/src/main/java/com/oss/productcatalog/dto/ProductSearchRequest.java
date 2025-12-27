package com.oss.productcatalog.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductSearchRequest {

    // free-text search (name / description)
    private String q;

    private String brand;

    private List<Long> categoryIds;

    private BigDecimal minPrice;

    private BigDecimal maxPrice;

    private Boolean onlyActive = true;

    // pagination
    private Integer page = 0;
    private Integer size = 20;

    // sorting example: "price,asc" or "name,desc"
    private String sort = "name,asc";
}
