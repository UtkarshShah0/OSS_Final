import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product, Review, Category } from './models';

// API gateway base URL (gateway routes /api/products/** to product-catalog)
const API_BASE_URL = 'http://localhost:9090/api';

export interface ProductResponse {
  id: number;
  sku: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  currency: string;
  stock: number;
  availabilityStatus: 'IN_STOCK' | 'OUT_OF_STOCK';
  specifications?: { [key: string]: string };
  categories: string[];
  imageUrls: string[];
  averageRating: number;
  reviewCount: number;
  reviews: ReviewResponse[];
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

export interface ReviewRequest {
  userId: number;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = API_BASE_URL;

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<ProductResponse[]>(`${this.apiUrl}/products`).pipe(
      map(products => products.map(p => this.mapToProduct(p)))
    );
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/products/${id}`).pipe(
      map(p => this.mapToProduct(p))
    );
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.getAllProducts().pipe(
      map(products => products.filter(p => 
        p.categories?.some(c => c.toLowerCase() === category.toLowerCase())
      ))
    );
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.getAllProducts().pipe(
      map(products => products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description?.toLowerCase().includes(query.toLowerCase()) ||
        p.brand?.toLowerCase().includes(query.toLowerCase())
      ))
    );
  }

  getCategories(): Observable<Category[]> {
    return this.getAllProducts().pipe(
      map(products => {
        const categoryMap = new Map<string, number>();
        products.forEach(product => {
          product.categories?.forEach(cat => {
            categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
          });
        });
        
        return Array.from(categoryMap.entries()).map(([name, count], index) => ({
          id: index + 1,
          name: name,
          slug: name.toLowerCase().replace(/\s+/g, '-'),
          icon: this.getCategoryIcon(name),
          image: this.getCategoryImage(name),
          productCount: count
        }));
      })
    );
  }

  getReviews(productId: number): Observable<Review[]> {
    return this.http.get<ReviewResponse[]>(`${this.apiUrl}/products/${productId}/reviews`).pipe(
      map(reviews => reviews.map(r => this.mapToReview(r)))
    );
  }

  createReview(productId: number, review: ReviewRequest): Observable<Review> {
    return this.http.post<ReviewResponse>(`${this.apiUrl}/products/${productId}/reviews`, review).pipe(
      map(r => this.mapToReview(r))
    );
  }

  getProductImageUrl(imageId: number): string {
    return `${this.apiUrl}/products/image/${imageId}`;
  }

  private mapToProduct(response: ProductResponse): Product {
    return {
      id: response.id,
      name: response.name,
      description: response.description || '',
      price: response.price,
      originalPrice: undefined,
      discount: undefined,
      rating: response.averageRating || 0,
      reviewCount: response.reviewCount || 0,
      images: response.imageUrls || [],
      category: response.categories?.[0] || '',
      categories: response.categories || [],
      brand: response.brand || '',
      inStock: response.availabilityStatus === 'IN_STOCK',
      stockCount: response.stock || 0,
      specifications: response.specifications,
      reviews: response.reviews?.map(r => this.mapToReview(r)) || [],
      tags: []
    };
  }

  private mapToReview(response: ReviewResponse): Review {
    return {
      id: response.id,
      userId: response.userId,
      userName: response.userName,
      userAvatar: response.userAvatar,
      rating: response.rating,
      title: response.title,
      comment: response.comment,
      date: new Date(response.createdAt).toISOString().split('T')[0],
      verifiedPurchase: response.verifiedPurchase,
      helpful: response.helpfulCount
    };
  }

  private getCategoryIcon(categoryName: string): string {
    // Return emoji glyphs (revert to emojis for in-line display)
    const icons: { [key: string]: string } = {
      'Electronics': '📱',
      'Fashion': '👕',
      'Home & Living': '🏠',
      'Sports': '⚽',
      'Books': '📚',
      'Beauty': '💄'
    };
    return icons[categoryName] || '📦';
  }

  private getCategoryImage(categoryName: string): string {
    const images: { [key: string]: string } = {
      'Electronics': 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&q=80',
      'Fashion': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
      'Home & Living': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
      'Sports': 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80',
      'Books': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80',
      'Beauty': 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&q=80'
    };
    return images[categoryName] || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80';
  }
}

