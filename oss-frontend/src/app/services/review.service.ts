import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Review } from './models';

const API_GATEWAY = 'http://localhost:9090';

export interface ReviewRequest {
  userId: number;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase?: boolean;
}

export interface ReviewResponse {
  id: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private http: HttpClient) {}

  // Get reviews for a product
  getReviews(productId: number): Observable<ReviewResponse[]> {
    return this.http.get<ReviewResponse[]>(`${API_GATEWAY}/api/products/${productId}/reviews`).pipe(
      catchError(() => of([]))
    );
  }

  // Create a new review
  createReview(productId: number, review: ReviewRequest): Observable<ReviewResponse> {
    return this.http.post<ReviewResponse>(`${API_GATEWAY}/api/products/${productId}/reviews`, review).pipe(
      catchError(() => of({} as ReviewResponse))
    );
  }

  // Get average rating for a product
  getAverageRating(productId: number): Observable<number> {
    return this.http.get<number>(`${API_GATEWAY}/api/products/${productId}/reviews/average-rating`).pipe(
      catchError(() => of(0))
    );
  }

  // Get review count for a product
  getReviewCount(productId: number): Observable<number> {
    return this.http.get<number>(`${API_GATEWAY}/api/products/${productId}/reviews/count`).pipe(
      catchError(() => of(0))
    );
  }
}