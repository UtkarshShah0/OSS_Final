package com.oss.productcatalog.service;

import com.oss.productcatalog.dto.ReviewRequest;
import com.oss.productcatalog.dto.ReviewResponse;

import java.util.List;

public interface ReviewService {
    ReviewResponse createReview(Long productId, ReviewRequest request);
    List<ReviewResponse> getReviewsByProductId(Long productId);
    Double getAverageRating(Long productId);
    Long getReviewCount(Long productId);
}

