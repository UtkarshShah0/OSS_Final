import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../../services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  private subscription: Subscription | null = null;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCart();
    this.subscription = this.cartService.cart$.subscribe(() => {
      this.loadCart();
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadCart() {
    this.cartItems = this.cartService.getCartItems();
  }

  updateQuantity(item: CartItem, quantity: number) {
    if (quantity <= 0) {
      this.removeItem(item);
    } else {
      this.cartService.updateQuantity(item.product.id, quantity);
    }
  }

  removeItem(item: CartItem) {
    this.cartService.removeFromCart(item.product.id);
  }

  getSubtotal(): number {
    return this.cartService.getSubtotal();
  }

  getTotalDiscount(): number {
    return this.cartService.getTotalDiscount();
  }

  getShipping(): number {
    const subtotal = this.getSubtotal();
    return subtotal > 50000 ? 0 : 500;
  }

  getTax(): number {
    return this.getSubtotal() * 0.18; // 18% GST
  }

  getTotal(): number {
    return this.getSubtotal() + this.getShipping() + this.getTax() - this.getTotalDiscount();
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  }

  proceedToCheckout() {
    if (this.cartItems.length > 0) {
      this.router.navigate(['/checkout']);
    }
  }

  continueShopping() {
    this.router.navigate(['/products']);
  }
}
