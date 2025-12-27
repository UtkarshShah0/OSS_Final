package com.oss.productcatalog.service;

import java.util.List;

import com.oss.productcatalog.dto.ProductRequest;
import com.oss.productcatalog.dto.ProductResponse;

public interface ProductService {

    ProductResponse createProduct(ProductRequest request);

    ProductResponse getProductById(Long id);

    List<ProductResponse> getAllProducts();
}