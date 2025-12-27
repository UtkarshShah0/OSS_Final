package com.oss.productcatalog.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.oss.productcatalog.dto.ProductRequest;
import com.oss.productcatalog.dto.ProductResponse;
import com.oss.productcatalog.dto.ReviewResponse;
import com.oss.productcatalog.exception.ResourceNotFoundException;
import com.oss.productcatalog.model.Category;
import com.oss.productcatalog.model.Product;
import com.oss.productcatalog.model.ProductImage;
import com.oss.productcatalog.model.AvailabilityStatus;
import com.oss.productcatalog.repository.CategoryRepository;
import com.oss.productcatalog.repository.ProductRepository;
import com.oss.productcatalog.repository.ReviewRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService {
	
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Override
    public ProductResponse createProduct(ProductRequest request) {

        Product product = new Product();
        product.setSku(request.getSku());
        product.setName(request.getName());
        product.setBrand(request.getBrand());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setDescription(request.getDescription());
        product.setAvailabilityStatus(
                request.getStock() > 0
                        ? AvailabilityStatus.IN_STOCK
                        : AvailabilityStatus.OUT_OF_STOCK
        );

        if (request.getCategoryIds() != null) {
            Set<Category> categories = new HashSet<>(
                    categoryRepository.findAllById(request.getCategoryIds())
            );
            product.setCategories(categories);
        }

        return mapToResponse(productRepository.save(product));
    }

    @Override
    public ProductResponse getProductById(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Product not found with id: " + id)
                );

        return mapToResponse(product);
    }

    @Override
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private ProductResponse mapToResponse(Product product) {

        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setSku(product.getSku());
        response.setName(product.getName());
        response.setBrand(product.getBrand());
        response.setDescription(product.getDescription());
        response.setPrice(product.getPrice());
        response.setCurrency(product.getCurrency());
        response.setStock(product.getStock());
        response.setAvailabilityStatus(product.getAvailabilityStatus());
        response.setSpecifications(product.getSpecifications());
        response.setCategories(
                product.getCategories()
                        .stream()
                        .map(Category::getName)
                        .collect(Collectors.toSet())
        );
        
        // Map images: prefer external image_url when present, otherwise serve internal binary endpoint
        List<String> imageUrls = product.getImages().stream()
            .map((ProductImage image) -> {
                if (image.getImageUrl() != null && !image.getImageUrl().isBlank()) {
                    return image.getImageUrl();
                }
                return "http://localhost:9090/products/image/" + image.getId();
            })
            .collect(Collectors.toList());
        response.setImageUrls(imageUrls);
        
        // Calculate average rating and review count
        Long productId = product.getId();
        List<com.oss.productcatalog.model.Review> reviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
        if (!reviews.isEmpty()) {
            double avgRating = reviews.stream()
                    .mapToInt(com.oss.productcatalog.model.Review::getRating)
                    .average()
                    .orElse(0.0);
            response.setAverageRating(avgRating);
            response.setReviewCount((long) reviews.size());
            
            // Map reviews to ReviewResponse
            List<ReviewResponse> reviewResponses = reviews.stream()
                    .map(this::mapReviewToResponse)
                    .collect(Collectors.toList());
            response.setReviews(reviewResponses);
        } else {
            response.setAverageRating(0.0);
            response.setReviewCount(0L);
            response.setReviews(new ArrayList<>());
        }
        
        return response;
    }
    
    private ReviewResponse mapReviewToResponse(com.oss.productcatalog.model.Review review) {
        ReviewResponse response = new ReviewResponse();
        response.setId(review.getId());
        response.setUserId(review.getUserId());
        response.setUserName(review.getUserName());
        response.setUserAvatar(review.getUserAvatar());
        response.setRating(review.getRating());
        response.setTitle(review.getTitle());
        response.setComment(review.getComment());
        response.setVerifiedPurchase(review.getVerifiedPurchase());
        response.setHelpfulCount(review.getHelpfulCount());
        response.setCreatedAt(review.getCreatedAt());
        return response;
    }
}
