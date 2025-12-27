import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, Address, PaymentMethod, Order } from './models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();
  private tokenKey = 'token';
  private userKey = 'user';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const token = localStorage.getItem(this.tokenKey);
    const userStr = localStorage.getItem(this.userKey);
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
      } catch (e) {
        this.logout();
      }
    }
  }

  login(email: string, password: string): boolean {
    // Mock authentication - in real app, this would call an API
    if (email && password) {
      const mockUser: User = {
        id: 1,
        email: email,
        name: email.split('@')[0],
        phone: '+1234567890',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
        addresses: [
          {
            id: 1,
            fullName: 'John Doe',
            phone: '+1234567890',
            addressLine1: '123 Main Street',
            addressLine2: 'Apt 4B',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA',
            isDefault: true
          }
        ],
        paymentMethods: [
          {
            id: 1,
            type: 'card',
            cardNumber: '**** **** **** 4242',
            cardHolder: 'John Doe',
            expiryMonth: 12,
            expiryYear: 2025,
            isDefault: true
          }
        ],
        orders: [],
        wishlist: []
      };

      const token = 'mock.jwt.token.' + Date.now();
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(this.tokenKey, token);
        localStorage.setItem(this.userKey, JSON.stringify(mockUser));
      }
      this.currentUserSubject.next(mockUser);
      return true;
    }
    return false;
  }

  register(email: string, password: string, name: string): boolean {
    // Mock registration
    if (email && password && name) {
      return this.login(email, password);
    }
    return false;
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
    }
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }
    return !!localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  updateUser(user: User): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.userKey, JSON.stringify(user));
    }
    this.currentUserSubject.next(user);
  }

  addAddress(address: Address): void {
    const user = this.getCurrentUser();
    if (user) {
      address.id = user.addresses.length + 1;
      user.addresses.push(address);
      this.updateUser(user);
    }
  }

  addPaymentMethod(paymentMethod: PaymentMethod): void {
    const user = this.getCurrentUser();
    if (user) {
      paymentMethod.id = user.paymentMethods.length + 1;
      user.paymentMethods.push(paymentMethod);
      this.updateUser(user);
    }
  }

  addToWishlist(productId: number): void {
    const user = this.getCurrentUser();
    if (user && !user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      this.updateUser(user);
    }
  }

  removeFromWishlist(productId: number): void {
    const user = this.getCurrentUser();
    if (user) {
      user.wishlist = user.wishlist.filter(id => id !== productId);
      this.updateUser(user);
    }
  }

  isInWishlist(productId: number): boolean {
    const user = this.getCurrentUser();
    return user ? user.wishlist.includes(productId) : false;
  }
}

