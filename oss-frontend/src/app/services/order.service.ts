import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Order, OrderItem, Address, PaymentMethod } from './models';
import { CartService } from './cart.service';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

const API_GATEWAY = 'http://localhost:9090';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private http: HttpClient
  ) { }

  createOrder(shippingAddress: Address, paymentMethod: PaymentMethod): Observable<Order> {
    const cartItems = this.cartService.getCartItems();
    const user = this.authService.getCurrentUser();

    const orderItems: OrderItem[] = cartItems.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      productImage: item.product.images?.[0] || '',
      quantity: item.quantity,
      price: item.product.price,
      total: item.product.price * item.quantity
    }));

    const subtotal = this.cartService.getSubtotal();
    const shipping = subtotal > 50000 ? 0 : 500; // Free shipping over ₹50,000
    const tax = subtotal * 0.18; // 18% GST
    const discount = this.cartService.getTotalDiscount();
    const total = subtotal + shipping + tax - discount;

    const order: Order = {
      id: 'ORD-' + Date.now(),
      date: new Date().toISOString(),
      status: 'pending',
      items: orderItems,
      subtotal,
      shipping,
      tax,
      discount,
      total,
      shippingAddress,
      paymentMethod,
      trackingNumber: '',
      estimatedDelivery: this.calculateDeliveryDate(7)
    };

    // If user logged in, send order to backend
    if (user) {
      const url = `${API_GATEWAY}/api/orders/`;
      return this.http.post<Order>(url, order).pipe(map(res => {
        // Clear cart and update user orders
        this.cartService.clearCart();
        try {
          if (user.orders) user.orders.push(res);
          else user.orders = [res];
          this.authService.updateUser(user);
        } catch {}
        return res;
      }));
    }

    // Anonymous users: store locally and return observable
    if (typeof localStorage !== 'undefined') {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.push(order);
      localStorage.setItem('orders', JSON.stringify(orders));
    }
    this.cartService.clearCart();
    return of(order);
  }

  getOrders(): Observable<Order[]> {
    const user = this.authService.getCurrentUser();
    if (user && user.orders) {
      return of(user.orders);
    }
    // Return orders from localStorage for anonymous users
    if (typeof localStorage !== 'undefined') {
      try {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        return of(orders);
      } catch {
        return of([]);
      }
    }
    return of([]);
  }

  getOrderById(orderId: string): Order | null {
    const user = this.authService.getCurrentUser();
    if (user && user.orders) {
      const order = user.orders.find(o => o.id === orderId);
      if (order) return order;
    }
    // Check localStorage for anonymous users
    if (typeof localStorage !== 'undefined') {
      try {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        return orders.find((o: Order) => o.id === orderId) || null;
      } catch {
        return null;
      }
    }
    return null;
  }

  private calculateDeliveryDate(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }

  cancelOrder(orderId: string): boolean {
    const user = this.authService.getCurrentUser();
    if (user && user.orders) {
      const order = user.orders.find(o => o.id === orderId);
      if (order && (order.status === 'pending' || order.status === 'confirmed')) {
        order.status = 'cancelled';
        this.authService.updateUser(user);
        return true;
      }
    }
    // For anonymous users, update in localStorage
    if (typeof localStorage !== 'undefined') {
      try {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const order = orders.find((o: Order) => o.id === orderId);
        if (order && (order.status === 'pending' || order.status === 'confirmed')) {
          order.status = 'cancelled';
          localStorage.setItem('orders', JSON.stringify(orders));
          return true;
        }
      } catch {
        return false;
      }
    }
    return false;
  }
}

