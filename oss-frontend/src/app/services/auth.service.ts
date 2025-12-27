import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { User, Address, PaymentMethod, Order } from './models';

const API_GATEWAY = 'http://localhost:9090';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();
  private tokenKey = 'token';
  private userKey = 'user';

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const userStr = localStorage.getItem(this.userKey);
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
      } catch (e) {
        this.logout();
      }
    }
  }

  login(emailOrPhone: string, password: string): Observable<boolean> {
    const url = `${API_GATEWAY}/auth/login`;
    const params = new HttpParams().set('emailOrPhone', emailOrPhone).set('password', password);
    return this.http.post<User>(url, null, { params }).pipe(
      tap(user => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem(this.userKey, JSON.stringify(user));
          localStorage.setItem(this.tokenKey, '');
        }
        this.currentUserSubject.next(user);
      }),
      map(() => true),
      catchError(() => of(false))
    );
  }

  register(email: string | null, password: string, name?: string): Observable<boolean> {
    const url = `${API_GATEWAY}/auth/register`;
    let params = new HttpParams().set('password', password);
    if (email) params = params.set('email', email);
    return this.http.post<User>(url, null, { params }).pipe(
      tap(user => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem(this.userKey, JSON.stringify(user));
          localStorage.setItem(this.tokenKey, '');
        }
        this.currentUserSubject.next(user);
      }),
      map(() => true),
      catchError(() => of(false))
    );
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
    return !!localStorage.getItem(this.userKey);
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

