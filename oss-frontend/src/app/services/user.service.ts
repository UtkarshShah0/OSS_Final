import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Address, PaymentMethod, Order } from './models';

const API_GATEWAY = 'http://localhost:9090';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  // Address Management
  getAddresses(userId: number): Observable<Address[]> {
    return this.http.get<Address[]>(`${API_GATEWAY}/users/${userId}/addresses`).pipe(
      catchError(() => of([]))
    );
  }

  addAddress(userId: number, address: Address): Observable<Address> {
    return this.http.post<Address>(`${API_GATEWAY}/users/${userId}/addresses`, address).pipe(
      catchError(() => of({} as Address))
    );
  }

  deleteAddress(userId: number, addressId: number): Observable<any> {
    return this.http.delete(`${API_GATEWAY}/users/${userId}/addresses/${addressId}`).pipe(
      catchError(() => of({}))
    );
  }

  // Payment Method Management
  getPaymentMethods(userId: number): Observable<PaymentMethod[]> {
    return this.http.get<PaymentMethod[]>(`${API_GATEWAY}/users/${userId}/payments`).pipe(
      catchError(() => of([]))
    );
  }

  addPaymentMethod(userId: number, provider: string, token: string): Observable<PaymentMethod> {
    return this.http.post<PaymentMethod>(`${API_GATEWAY}/users/${userId}/payments`, {
      provider,
      token
    }).pipe(
      catchError(() => of({} as PaymentMethod))
    );
  }

  // Order Management
  getOrders(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${API_GATEWAY}/users/${userId}/orders`).pipe(
      catchError(() => of([]))
    );
  }

  // Cart Management
  getCart(userId: number): Observable<any> {
    return this.http.get(`${API_GATEWAY}/cart/${userId}`).pipe(
      catchError(() => of({ items: [] }))
    );
  }

  addToCart(userId: number, productId: number, quantity: number, variant?: string): Observable<any> {
    const params = new URLSearchParams();
    params.append('productId', productId.toString());
    params.append('quantity', quantity.toString());
    if (variant) {
      params.append('variant', variant);
    }

    return this.http.post(`${API_GATEWAY}/cart/${userId}/items?${params.toString()}`, {}).pipe(
      catchError(() => of({}))
    );
  }

  updateCartItem(userId: number, itemId: number, quantity: number): Observable<any> {
    return this.http.put(`${API_GATEWAY}/cart/${userId}/items/${itemId}?quantity=${quantity}`, {}).pipe(
      catchError(() => of({}))
    );
  }

  removeFromCart(userId: number, itemId: number): Observable<any> {
    return this.http.delete(`${API_GATEWAY}/cart/${userId}/items/${itemId}`).pipe(
      catchError(() => of({}))
    );
  }

  // Checkout
  checkout(userId: number, addressId: number, shipping: string, method: string): Observable<any> {
    return this.http.post(`${API_GATEWAY}/checkout?userId=${userId}&addressId=${addressId}&shipping=${shipping}&method=${method}`, {}).pipe(
      catchError(() => of({}))
    );
  }

  // Wishlist Management
  getWishlist(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${API_GATEWAY}/users/${userId}/wishlist`).pipe(
      catchError(() => of([]))
    );
  }

  addToWishlist(userId: number, productId: number): Observable<any> {
    return this.http.post(`${API_GATEWAY}/users/${userId}/wishlist`, { productId }).pipe(
      catchError(() => of({}))
    );
  }

  removeFromWishlist(userId: number, productId: number): Observable<any> {
    return this.http.delete(`${API_GATEWAY}/users/${userId}/wishlist/${productId}`).pipe(
      catchError(() => of({}))
    );
  }
}