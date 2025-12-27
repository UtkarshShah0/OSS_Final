package com.oss.productcatalog.service;

import com.oss.productcatalog.dto.ReviewRequest;
import com.oss.productcatalog.dto.ReviewResponse;
import com.oss.productcatalog.exception.ResourceNotFoundException;
import com.oss.productcatalog.model.Product;
import com.oss.productcatalog.model.Review;
import com.oss.productcatalog.repository.ProductRepository;
import com.oss.productcatalog.repository.ReviewRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;

    public ReviewServiceImpl(ReviewRepository reviewRepository, ProductRepository productRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
    }

    @Override
    public ReviewResponse createReview(Long productId, ReviewRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        Review review = new Review();
        review.setProduct(product);
        review.setUserId(request.getUserId());
        review.setUserName(request.getUserName());
        review.setUserAvatar(request.getUserAvatar());
        review.setRating(request.getRating());
        review.setTitle(request.getTitle());
        review.setComment(request.getComment());
        review.setVerifiedPurchase(request.getVerifiedPurchase() != null ? request.getVerifiedPurchase() : false);
        review.setHelpfulCount(0);

        Review savedReview = reviewRepository.save(review);
        return mapToResponse(savedReview);
    }

    @Override
    public List<ReviewResponse> getReviewsByProductId(Long productId) {
        List<Review> reviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
        return reviews.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Double getAverageRating(Long productId) {
        List<Review> reviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
        if (reviews.isEmpty()) {
            return 0.0;
        }
        return reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
    }

    @Override
    public Long getReviewCount(Long productId) {
        return reviewRepository.countByProductId(productId);
    }

    private ReviewResponse mapToResponse(Review review) {
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

