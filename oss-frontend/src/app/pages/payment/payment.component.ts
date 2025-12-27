import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
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
  
  walletTypes: ('apple' | 'google' | 'paypal')[] = ['apple', 'google', 'paypal'];
  months: number[] = Array.from({ length: 12 }, (_, i) => i + 1);
  years: number[] = Array.from({ length: 20 }, (_, i) => new Date().getFullYear() + i);

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadPaymentMethods();
  }

  loadPaymentMethods() {
    this.user = this.authService.getCurrentUser();
    if (this.user && this.user.paymentMethods) {
      this.paymentMethods = this.user.paymentMethods;
    }
  }

  addPaymentMethod() {
    if (this.validatePaymentMethod()) {
      if (this.newPaymentMethod.isDefault) {
        // Remove default from other methods
        this.paymentMethods.forEach(method => method.isDefault = false);
      }
      
      this.authService.addPaymentMethod(this.newPaymentMethod);
      this.loadPaymentMethods();
      this.resetForm();
      this.showAddForm = false;
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
    if (this.newPaymentMethod.type === 'card') {
      return !!(
        this.newPaymentMethod.cardNumber &&
        this.newPaymentMethod.cardHolder &&
        this.newPaymentMethod.expiryMonth &&
        this.newPaymentMethod.expiryYear
      );
    } else if (this.newPaymentMethod.type === 'wallet') {
      return !!this.newPaymentMethod.walletType;
    }
    return false;
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

  getWalletIcon(walletType?: string): string {
    switch (walletType) {
      case 'apple': return '🍎';
      case 'google': return '📱';
      case 'paypal': return '💳';
      default: return '💼';
    }
  }

  getWalletName(walletType?: string): string {
    switch (walletType) {
      case 'apple': return 'Apple Pay';
      case 'google': return 'Google Pay';
      case 'paypal': return 'PayPal';
      default: return 'Wallet';
    }
  }
}