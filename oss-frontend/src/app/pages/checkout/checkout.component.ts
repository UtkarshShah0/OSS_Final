import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Address, PaymentMethod } from '../../services/models';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  currentStep = 1;
  steps = ['Shipping', 'Payment', 'Review'];
  
  cartItems: any[] = [];
  selectedAddress: Address | null = null;
  selectedPaymentMethod: PaymentMethod | null = null;
  
  newAddress: Address = {
    id: 0,
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    isDefault: false
  };
  
  newPaymentMethod: PaymentMethod = {
    id: 0,
    type: 'card',
    cardNumber: '',
    cardHolder: '',
    expiryMonth: 0,
    expiryYear: 0,
    isDefault: false
  };
  
  showNewAddressForm = false;
  showNewPaymentForm = false;
  
  user: any = null;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    
    this.cartItems = this.cartService.getCartItems();
    if (this.cartItems.length === 0) {
      this.router.navigate(['/cart']);
      return;
    }
    
    if (this.user && this.user.addresses && this.user.addresses.length > 0) {
      this.selectedAddress = this.user.addresses.find((a: Address) => a.isDefault) || this.user.addresses[0];
    }
    
    if (this.user && this.user.paymentMethods && this.user.paymentMethods.length > 0) {
      this.selectedPaymentMethod = this.user.paymentMethods.find((p: PaymentMethod) => p.isDefault) || this.user.paymentMethods[0];
    }
  }

  nextStep() {
    if (this.currentStep < this.steps.length) {
      if (this.currentStep === 1 && !this.selectedAddress) {
        alert('Please select or add a shipping address');
        return;
      }
      if (this.currentStep === 2 && !this.selectedPaymentMethod) {
        alert('Please select or add a payment method');
        return;
      }
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  addNewAddress() {
    if (this.validateAddress()) {
      // For anonymous users, just use the address directly
      if (this.user) {
        this.authService.addAddress(this.newAddress);
      }
      this.selectedAddress = this.newAddress;
      this.showNewAddressForm = false;
      this.resetNewAddress();
    }
  }

  addNewPaymentMethod() {
    if (this.validatePaymentMethod()) {
      // For anonymous users, just use the payment method directly
      if (this.user) {
        this.authService.addPaymentMethod(this.newPaymentMethod);
      }
      this.selectedPaymentMethod = this.newPaymentMethod;
      this.showNewPaymentForm = false;
      this.resetNewPaymentMethod();
    }
  }

  validateAddress(): boolean {
    return !!(this.newAddress.fullName && this.newAddress.phone && 
              this.newAddress.addressLine1 && this.newAddress.city && 
              this.newAddress.state && this.newAddress.zipCode);
  }

  validatePaymentMethod(): boolean {
    return !!(this.newPaymentMethod.cardNumber && this.newPaymentMethod.cardHolder && 
              this.newPaymentMethod.expiryMonth && this.newPaymentMethod.expiryYear);
  }

  resetNewAddress() {
    this.newAddress = {
      id: 0,
      fullName: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India',
      isDefault: false
    };
  }

  resetNewPaymentMethod() {
    this.newPaymentMethod = {
      id: 0,
      type: 'card',
      cardNumber: '',
      cardHolder: '',
      expiryMonth: 0,
      expiryYear: 0,
      isDefault: false
    };
  }

  placeOrder() {
    if (this.selectedAddress && this.selectedPaymentMethod) {
      const order = this.orderService.createOrder(this.selectedAddress, this.selectedPaymentMethod);
      this.router.navigate(['/profile'], { queryParams: { tab: 'orders', orderId: order.id } });
    }
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
    return this.getSubtotal() * 0.18;
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

  formatCardNumber(cardNumber: string): string {
    return '**** **** **** ' + cardNumber.slice(-4);
  }
}
