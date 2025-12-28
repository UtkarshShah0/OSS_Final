import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Product } from './models';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { ProductService } from './product.service';

const API_GATEWAY = 'http://localhost:9090';

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

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private http: HttpClient, private auth: AuthService, private productService: ProductService) {
    this.loadCartFromStorage();
    // When user logs in, sync local cart to server and load server cart
    this.auth.currentUser$.subscribe(user => {
      if (user) {
        this.syncLocalCartToServer(user.id).then(() => this.fetchCartFromServer(user.id));
      }
    });
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
    // If user logged in, try to add to remote cart as well
    const user = this.auth.getCurrentUser();
    if (user) {
      this.addToCartRemote(user.id, product.id, quantity).subscribe();
    }
  }

  removeFromCart(productId: number): void {
    const user = this.auth.getCurrentUser();
    if (user) {
      const url = `${API_GATEWAY}/cart/${user.id}/items/${productId}`;
      this.http.delete(url).pipe(catchError(() => of(null))).subscribe(() => this.fetchCartFromServer(user.id));
      return;
    }
    this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
    this.saveCartToStorage();
  }

  updateQuantity(productId: number, quantity: number): void {
    const user = this.auth.getCurrentUser();
    if (user) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
        return;
      }
      const url = `${API_GATEWAY}/cart/${user.id}/items/${productId}?quantity=${quantity}`;
      this.http.put(url, null).pipe(catchError(() => of(null))).subscribe(() => this.fetchCartFromServer(user.id));
      return;
    }
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

  // Remote cart integration
  private addToCartRemote(userId: number, productId: number, quantity: number) {
    const url = `${API_GATEWAY}/cart/${userId}/items`;
    const params = new HttpParams().set('productId', `${productId}`).set('quantity', `${quantity}`);
    return this.http.post(url, null, { params });
  }

  private async syncLocalCartToServer(userId: number): Promise<void> {
    const items = this.cartItems.slice();
    for (const it of items) {
      try {
        await this.addToCartRemote(userId, it.product.id, it.quantity).toPromise();
      } catch (e) {
        // ignore per-item errors
      }
    }
  }

  fetchCartFromServer(userId: number): void {
    const url = `${API_GATEWAY}/cart/${userId}`;
    this.http.get<any>(url).pipe(catchError(() => of(null))).subscribe(cart => {
      if (!cart || !Array.isArray(cart.items)) {
        this.cartItems = [];
        this.saveCartToStorage();
        return;
      }
      const productCalls: Observable<Product | null>[] = cart.items.map((it: any) =>
        this.productService.getProductById(it.productId).pipe(catchError(() => of(null)))
      );
      if (productCalls.length === 0) {
        this.cartItems = [];
        this.saveCartToStorage();
        return;
      }
      forkJoin(productCalls).subscribe((products: (Product | null)[]) => {
        this.cartItems = products.map((p: Product | null, idx: number) => {
          const qty = cart.items[idx]?.quantity || 1;
          if (p) {
            return { product: p as Product, quantity: qty } as CartItem;
          }
          // fallback minimal product object
          return { product: { id: cart.items[idx].productId } as Product, quantity: qty } as CartItem;
        });
        this.saveCartToStorage();
      });
    });
  }
}

