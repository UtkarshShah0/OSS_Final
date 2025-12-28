import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, of, forkJoin } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Product } from './models';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { ProductService } from './product.service';

const API_GATEWAY = 'http://localhost:9090';

export interface CartItem {
  product: Product;
  quantity: number;
  itemId?: number; // Backend cart item ID
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  public cart$: Observable<CartItem[]> = this.cartSubject.asObservable();
  private cartCleared = false; // Flag to prevent reloading after clearing

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object, 
    private http: HttpClient, 
    private auth: AuthService,
    private productService: ProductService
  ) {
    this.loadCartFromStorage();
    
    // Load from database when user logs in
    this.auth.currentUser$.subscribe(user => {
      if (user && !this.cartCleared) {
        this.loadCartFromDatabase(user.id);
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

  private loadCartFromDatabase(userId: number): void {
    this.http.get(`${API_GATEWAY}/cart/${userId}`, { responseType: 'text' }).pipe(
      catchError(() => of('{"items":[]}')),
      map(response => {
        try {
          return JSON.parse(response);
        } catch {
          return { items: [] };
        }
      })
    ).subscribe(cart => {
      if (cart && cart.items && cart.items.length > 0) {
        // Load products for cart items
        const productCalls = cart.items.map((item: any) =>
          this.productService.getProductById(item.productId).pipe(
            catchError((error) => {
              console.warn(`Product ${item.productId} not found, removing from cart`);
              // Remove invalid product from database cart
              this.http.delete(`${API_GATEWAY}/cart/${userId}/items/${item.id}`, { responseType: 'text' }).pipe(
                catchError(() => of(''))
              ).subscribe();
              return of(null);
            })
          )
        );
        
        forkJoin(productCalls).subscribe((products: any) => {
          this.cartItems = products.map((product: Product | null, index: number) => {
            const cartItem = cart.items[index];
            if (!product) {
              return null; // Skip invalid products
            }
            return {
              product: product,
              quantity: cartItem.quantity,
              itemId: cartItem.id
            };
          }).filter((item: CartItem | null) => item !== null) as CartItem[];
          
          this.saveCartToStorage();
        });
      } else {
        // Database cart is empty, sync local cart if exists
        if (this.cartItems.length > 0) {
          this.syncLocalCartToDatabase(userId);
        }
      }
    });
  }

  private syncLocalCartToDatabase(userId: number): void {
    // Sync local cart items to database
    this.cartItems.forEach(item => {
      this.addToCartDatabase(userId, item.product.id, item.quantity).pipe(
        catchError((error) => {
          console.warn('Failed to sync cart item to database:', error);
          return of('error');
        })
      ).subscribe();
    });
  }

  addToCart(product: Product, quantity: number = 1): void {
    const user = this.auth.getCurrentUser();
    
    if (user) {
      // Logged in: Add to database first
      this.addToCartDatabase(user.id, product.id, quantity).subscribe({
        next: () => {
          // Update local cart after successful database update
          this.updateLocalCart(product, quantity);
        },
        error: () => {
          // Fallback to local cart if database fails
          this.updateLocalCart(product, quantity);
        }
      });
    } else {
      // Guest: Add to local cart only
      this.updateLocalCart(product, quantity);
    }
  }

  private updateLocalCart(product: Product, quantity: number): void {
    const existingItem = this.cartItems.find(item => item.product.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartItems.push({ product, quantity });
    }
    
    this.saveCartToStorage();
  }

  removeFromCart(productId: number): void {
    const user = this.auth.getCurrentUser();
    const item = this.cartItems.find(item => item.product.id === productId);
    
    if (user && item?.itemId) {
      // Logged in: Remove from database first
      this.http.delete(`${API_GATEWAY}/cart/${user.id}/items/${item.itemId}`, { responseType: 'text' }).pipe(
        catchError(() => of(''))
      ).subscribe(() => {
        this.removeFromLocalCart(productId);
      });
    } else {
      // Guest or fallback: Remove from local cart
      this.removeFromLocalCart(productId);
    }
  }

  private removeFromLocalCart(productId: number): void {
    this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
    this.saveCartToStorage();
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const user = this.auth.getCurrentUser();
    const item = this.cartItems.find(item => item.product.id === productId);
    
    if (user && item?.itemId) {
      // Logged in: Update database first
      this.http.put(`${API_GATEWAY}/cart/${user.id}/items/${item.itemId}?quantity=${quantity}`, {}, { responseType: 'text' }).pipe(
        catchError(() => of(''))
      ).subscribe(() => {
        this.updateLocalQuantity(productId, quantity);
      });
    } else {
      // Guest or fallback: Update local cart
      this.updateLocalQuantity(productId, quantity);
    }
  }

  private updateLocalQuantity(productId: number, quantity: number): void {
    const item = this.cartItems.find(item => item.product.id === productId);
    if (item) {
      item.quantity = quantity;
      this.saveCartToStorage();
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
    console.log('clearCart() called, current cart items:', this.cartItems.length);
    const user = this.auth.getCurrentUser();
    
    // Set flag to prevent reloading from database
    this.cartCleared = true;
    
    // Always clear local cart immediately for better UX
    const itemsToDelete = [...this.cartItems];
    this.cartItems = [];
    this.saveCartToStorage();
    console.log('Local cart cleared, items to delete from DB:', itemsToDelete.length);
    
    if (user && itemsToDelete.length > 0) {
      // Clear database cart asynchronously
      itemsToDelete.forEach((item, index) => {
        if (item.itemId) {
          console.log(`Deleting cart item ${index + 1}/${itemsToDelete.length}: itemId=${item.itemId}, productId=${item.product.id}`);
          this.http.delete(`${API_GATEWAY}/cart/${user.id}/items/${item.itemId}`, { responseType: 'text' }).pipe(
            catchError((error) => {
              console.warn('Failed to delete cart item from database:', error);
              return of('');
            })
          ).subscribe((result) => {
            console.log(`Cart item ${item.itemId} deleted from database:`, result);
          });
        }
      });
    }
    
    // Reset flag after a delay to allow future cart operations
    setTimeout(() => {
      this.cartCleared = false;
    }, 2000);
  }

  isInCart(productId: number): boolean {
    return this.cartItems.some(item => item.product.id === productId);
  }

  // Database operations
  private addToCartDatabase(userId: number, productId: number, quantity: number): Observable<any> {
    const url = `${API_GATEWAY}/cart/${userId}/items`;
    const params = new HttpParams()
      .set('productId', productId.toString())
      .set('quantity', quantity.toString());
    
    return this.http.post(url, null, { params, responseType: 'text' }).pipe(
      catchError(() => of('error'))
    );
  }
}