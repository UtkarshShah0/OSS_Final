package com.oss.productcatalog.controller;

import com.oss.productcatalog.dto.ReviewRequest;
import com.oss.productcatalog.dto.ReviewResponse;
import com.oss.productcatalog.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products/{productId}/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(
            @PathVariable Long productId,
            @RequestBody @Valid ReviewRequest request) {
        return ResponseEntity.ok(reviewService.createReview(productId, request));
    }

    @GetMapping
    public ResponseEntity<List<ReviewResponse>> getReviews(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getReviewsByProductId(productId));
    }

    @GetMapping("/average-rating")
    public ResponseEntity<Double> getAverageRating(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getAverageRating(productId));
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getReviewCount(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getReviewCount(productId));
    }
}

