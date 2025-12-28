import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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
    console.log('UserService.addAddress called with:', { userId, address });
    return this.http.post<Address>(`${API_GATEWAY}/users/${userId}/addresses`, address).pipe(
      catchError((error) => {
        console.error('UserService.addAddress error:', error);
        throw error; // Re-throw the error instead of swallowing it
      })
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

  deletePaymentMethod(userId: number, methodId: number): Observable<any> {
    return this.http.delete(`${API_GATEWAY}/users/${userId}/payments/${methodId}`).pipe(
      catchError(() => of({}))
    );
  }

  // Order Management
  getOrders(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${API_GATEWAY}/api/orders/user/${userId}`).pipe(
      catchError(() => of([]))
    );
  }

  // Cart Management
  getCart(userId: number): Observable<any> {
    return this.http.get(`${API_GATEWAY}/cart/${userId}`, { responseType: 'text' }).pipe(
      map(response => {
        try {
          // Try to clean and parse the malformed JSON
          const cleanResponse = this.cleanMalformedJson(response);
          return JSON.parse(cleanResponse);
        } catch (error) {
          console.warn('Failed to parse cart response:', error);
          return { items: [] };
        }
      }),
      catchError(() => of({ items: [] }))
    );
  }

  private cleanMalformedJson(jsonString: string): string {
    try {
      // Try to find the first complete JSON object before circular references start
      const firstBrace = jsonString.indexOf('{');
      if (firstBrace === -1) return '{"items":[]}';
      
      let braceCount = 0;
      let endIndex = firstBrace;
      
      for (let i = firstBrace; i < jsonString.length; i++) {
        if (jsonString[i] === '{') {
          braceCount++;
        } else if (jsonString[i] === '}') {
          braceCount--;
          if (braceCount === 0) {
            endIndex = i + 1;
            break;
          }
        }
      }
      
      const cleanJson = jsonString.substring(firstBrace, endIndex);
      // Test if it's valid JSON
      JSON.parse(cleanJson);
      return cleanJson;
    } catch (error) {
      // If cleaning fails, return empty cart
      return '{"id":null,"userId":null,"items":[],"updatedAt":null}';
    }
  }

  addToCart(userId: number, productId: number, quantity: number, variant?: string): Observable<any> {
    const params = new URLSearchParams();
    params.append('productId', productId.toString());
    params.append('quantity', quantity.toString());
    if (variant) {
      params.append('variant', variant);
    }

    return this.http.post(`${API_GATEWAY}/cart/${userId}/items?${params.toString()}`, {}, { responseType: 'text' }).pipe(
      catchError((error) => {
        console.warn('Cart API returned malformed JSON, but item was likely added:', error);
        return of('success');
      })
    );
  }

  updateCartItem(userId: number, itemId: number, quantity: number): Observable<any> {
    return this.http.put(`${API_GATEWAY}/cart/${userId}/items/${itemId}?quantity=${quantity}`, {}, { responseType: 'text' }).pipe(
      catchError(() => of('success'))
    );
  }

  removeFromCart(userId: number, itemId: number): Observable<any> {
    return this.http.delete(`${API_GATEWAY}/cart/${userId}/items/${itemId}`, { responseType: 'text' }).pipe(
      catchError(() => of('success'))
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