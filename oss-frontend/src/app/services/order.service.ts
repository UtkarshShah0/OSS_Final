import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Order, OrderItem, Address, PaymentMethod } from './models';
import { CartService } from './cart.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private cartService: CartService,
    private authService: AuthService
  ) { }

  createOrder(shippingAddress: Address, paymentMethod: PaymentMethod): Order {
    const cartItems = this.cartService.getCartItems();
    const user = this.authService.getCurrentUser();
    
    const orderItems: OrderItem[] = cartItems.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      productImage: item.product.images[0],
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
      status: 'confirmed',
      items: orderItems,
      subtotal,
      shipping,
      tax,
      discount,
      total,
      shippingAddress,
      paymentMethod,
      trackingNumber: 'TRK' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      estimatedDelivery: this.calculateDeliveryDate(7)
    };

    // Add order to user's order history if user exists
    if (user && user.orders) {
      user.orders.push(order);
      this.authService.updateUser(user);
    }

    // Clear cart
    this.cartService.clearCart();

    // Save order to localStorage for anonymous users
    if (typeof localStorage !== 'undefined') {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.push(order);
      localStorage.setItem('orders', JSON.stringify(orders));
    }

    return order;
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

