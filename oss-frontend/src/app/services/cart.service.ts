import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from './models';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  public cart$: Observable<CartItem[]> = this.cartSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.loadCartFromStorage();
  }

  private loadCartFromStorage(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const stored = localStorage.getItem('cart');
    if (stored) {
      try {
        this.cartItems = JSON.parse(stored);
        this.cartSubject.next(this.cartItems);
      } catch (e) {
        this.cartItems = [];
      }
    }
  }

  private saveCartToStorage(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
    this.cartSubject.next(this.cartItems);
  }

  addToCart(product: Product, quantity: number = 1): void {
    const existingItem = this.cartItems.find(item => item.product.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartItems.push({ product, quantity });
    }
    
    this.saveCartToStorage();
  }

  removeFromCart(productId: number): void {
    this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
    this.saveCartToStorage();
  }

  updateQuantity(productId: number, quantity: number): void {
    const item = this.cartItems.find(item => item.product.id === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        this.saveCartToStorage();
      }
    }
  }

  getCartItems(): CartItem[] {
    return this.cartItems;
  }

  getCartCount(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  getSubtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }

  getTotalDiscount(): number {
    return this.cartItems.reduce((sum, item) => {
      if (item.product.originalPrice) {
        const discount = (item.product.originalPrice - item.product.price) * item.quantity;
        return sum + discount;
      }
      return sum;
    }, 0);
  }

  clearCart(): void {
    this.cartItems = [];
    this.saveCartToStorage();
  }

  isInCart(productId: number): boolean {
    return this.cartItems.some(item => item.product.id === productId);
  }
}

