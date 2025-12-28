import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { PaymentMethod } from '../../services/models';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {
  paymentMethods: PaymentMethod[] = [];
  user: any = null;
  
  showAddForm = false;
  editingMethod: PaymentMethod | null = null;
  
  newPaymentMethod: PaymentMethod = {
    id: 0,
    type: 'card',
    cardNumber: '',
    cardHolder: '',
    expiryMonth: 0,
    expiryYear: 0,
    isDefault: false
  };
  
  bnplProviders: ('Klarna' | 'Afterpay' | 'Sezzle' | 'Affirm')[] = 
    ['Klarna', 'Afterpay', 'Sezzle', 'Affirm'];
  months: number[] = Array.from({ length: 12 }, (_, i) => i + 1);
  years: number[] = Array.from({ length: 20 }, (_, i) => new Date().getFullYear() + i);

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadPaymentMethods();
  }

  loadPaymentMethods() {
    this.user = this.authService.getCurrentUser();
    if (this.user) {
      // Load from backend
      this.userService.getPaymentMethods(this.user.id).subscribe(methods => {
        this.paymentMethods = methods;
        if (this.user) {
          this.user.paymentMethods = methods;
          this.authService.updateUser(this.user);
        }
      });
    }
  }

  addPaymentMethod() {
    if (this.validatePaymentMethod() && this.user) {
      if (this.newPaymentMethod.isDefault) {
        // Remove default from other methods
        this.paymentMethods.forEach(method => method.isDefault = false);
      }
      
      // Convert to backend format
      const provider = this.getProviderString();
      const token = this.getTokenString();
      
      this.userService.addPaymentMethod(this.user.id, provider, token).subscribe(method => {
        if (method.id) {
          this.loadPaymentMethods();
          this.resetForm();
          this.showAddForm = false;
        }
      });
    }
  }

  private getProviderString(): string {
    switch (this.newPaymentMethod.type) {
      case 'card': return 'CARD';
      case 'upi': return 'UPI';
      case 'cod': return 'COD';
      case 'bnpl': return 'BNPL';
      default: return 'CARD';
    }
  }

  private getTokenString(): string {
    switch (this.newPaymentMethod.type) {
      case 'card': 
        return `${this.newPaymentMethod.cardHolder}|${this.newPaymentMethod.cardNumber?.slice(-4)}|${this.newPaymentMethod.expiryMonth}/${this.newPaymentMethod.expiryYear}`;
      case 'upi': 
        return this.newPaymentMethod.upiId || '';
      case 'cod': 
        return 'COD_TOKEN';
      case 'bnpl': 
        return this.newPaymentMethod.bnplProvider || '';
      default: 
        return 'DEFAULT_TOKEN';
    }
  }

  editPaymentMethod(method: PaymentMethod) {
    this.editingMethod = { ...method };
    this.newPaymentMethod = { ...method };
    this.showAddForm = true;
  }

  updatePaymentMethod() {
    if (this.validatePaymentMethod() && this.editingMethod) {
      if (this.newPaymentMethod.isDefault) {
        // Remove default from other methods
        this.paymentMethods.forEach(method => {
          if (method.id !== this.editingMethod!.id) {
            method.isDefault = false;
          }
        });
      }
      
      const index = this.paymentMethods.findIndex(m => m.id === this.editingMethod!.id);
      if (index !== -1) {
        this.paymentMethods[index] = { ...this.newPaymentMethod, id: this.editingMethod.id };
        if (this.user) {
          this.user.paymentMethods = this.paymentMethods;
          this.authService.updateUser(this.user);
        }
      }
      
      this.resetForm();
      this.showAddForm = false;
      this.editingMethod = null;
    }
  }

  deletePaymentMethod(methodId: number) {
    if (confirm('Are you sure you want to delete this payment method?')) {
      if (this.user) {
        this.user.paymentMethods = this.user.paymentMethods.filter((m: PaymentMethod) => m.id !== methodId);
        this.authService.updateUser(this.user);
        this.loadPaymentMethods();
      }
    }
  }

  setDefaultMethod(methodId: number) {
    if (this.user) {
      this.user.paymentMethods.forEach((method: PaymentMethod) => {
        method.isDefault = method.id === methodId;
      });
      this.authService.updateUser(this.user);
      this.loadPaymentMethods();
    }
  }

  validatePaymentMethod(): boolean {
    switch (this.newPaymentMethod.type) {
      case 'card':
        return !!(
          this.newPaymentMethod.cardNumber &&
          this.newPaymentMethod.cardHolder &&
          this.newPaymentMethod.expiryMonth &&
          this.newPaymentMethod.expiryYear
        );
      case 'upi':
        return !!this.newPaymentMethod.upiId;
      case 'cod':
        return true; // COD doesn't need validation
      case 'bnpl':
        return !!this.newPaymentMethod.bnplProvider;
      default:
        return false;
    }
  }

  resetForm() {
    this.newPaymentMethod = {
      id: 0,
      type: 'card',
      cardNumber: '',
      cardHolder: '',
      expiryMonth: 0,
      expiryYear: 0,
      isDefault: false
    };
    this.editingMethod = null;
  }

  cancelForm() {
    this.resetForm();
    this.showAddForm = false;
  }

  formatCardNumber(cardNumber: string): string {
    if (!cardNumber) return '';
    const cleaned = cardNumber.replace(/\s/g, '');
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join(' ') : cleaned;
  }

  formatCardDisplay(cardNumber: string): string {
    if (!cardNumber) return '**** **** **** ****';
    const last4 = cardNumber.slice(-4);
    return `**** **** **** ${last4}`;
  }

  getBnplIcon(provider?: string): string {
    switch (provider) {
      case 'Klarna': return '🛍️';
      case 'Afterpay': return '⏰';
      case 'Sezzle': return '💳';
      case 'Affirm': return '✅';
      default: return '⏰';
    }
  }
}