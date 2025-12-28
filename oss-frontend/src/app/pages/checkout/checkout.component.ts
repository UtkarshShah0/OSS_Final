import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
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
    private userService: UserService,
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
    
    // Load fresh data from backend to ensure proper mapping
    if (this.user) {
      this.loadUserData();
    }
  }

  private loadUserData() {
    if (this.user) {
      // Load addresses
      this.userService.getAddresses(this.user.id).subscribe(addresses => {
        if (this.user) {
          this.user.addresses = addresses.map(addr => this.mapBackendAddressToFrontend(addr));
          if (this.user.addresses.length > 0) {
            this.selectedAddress = this.user.addresses.find((a: Address) => a.isDefault) || this.user.addresses[0];
          }
          this.authService.updateUser(this.user);
        }
      });

      // Load payment methods
      this.userService.getPaymentMethods(this.user.id).subscribe(methods => {
        if (this.user) {
          this.user.paymentMethods = methods.map(method => this.mapBackendPaymentMethodToFrontend(method));
          if (this.user.paymentMethods.length > 0) {
            this.selectedPaymentMethod = this.user.paymentMethods.find((p: PaymentMethod) => p.isDefault) || this.user.paymentMethods[0];
          }
          this.authService.updateUser(this.user);
        }
      });
    }
  }

  private mapBackendAddressToFrontend(backendAddress: any): Address {
    return {
      id: backendAddress.id,
      fullName: backendAddress.fullName || '',
      phone: backendAddress.phone || '',
      addressLine1: backendAddress.line1 || backendAddress.addressLine1 || '',
      addressLine2: backendAddress.line2 || backendAddress.addressLine2 || '',
      city: backendAddress.city || '',
      state: backendAddress.state || '',
      zipCode: backendAddress.postalCode || backendAddress.zipCode || '',
      country: backendAddress.country || '',
      isDefault: backendAddress.isDefault || false
    };
  }

  private mapBackendPaymentMethodToFrontend(backendMethod: any): PaymentMethod {
    const provider = backendMethod.provider;
    const token = backendMethod.token;
    
    let frontendMethod: PaymentMethod = {
      id: backendMethod.id,
      type: 'card',
      isDefault: false
    };

    if (provider === 'CARD') {
      frontendMethod.type = 'card';
      const lastFourMatch = token.match(/_(\d{4})$/);
      if (lastFourMatch) {
        frontendMethod.cardNumber = '**** **** **** ' + lastFourMatch[1];
      }
      frontendMethod.cardHolder = 'Card Holder';
    } else if (provider === 'UPI') {
      frontendMethod.type = 'upi';
      frontendMethod.upiId = 'UPI Payment';
    } else if (provider === 'COD') {
      frontendMethod.type = 'cod';
    } else if (provider === 'BNPL') {
      frontendMethod.type = 'bnpl';
      frontendMethod.bnplProvider = 'Klarna';
    }

    return frontendMethod;
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
      if (this.user) {
        // Map frontend fields to backend fields (don't send ID, let backend assign it)
        const addressToSave = {
          fullName: this.newAddress.fullName,
          phone: this.newAddress.phone,
          line1: this.newAddress.addressLine1,        // Map addressLine1 to line1
          line2: this.newAddress.addressLine2,        // Map addressLine2 to line2
          city: this.newAddress.city,
          state: this.newAddress.state,
          postalCode: this.newAddress.zipCode,        // Map zipCode to postalCode
          country: this.newAddress.country,
          isDefault: this.newAddress.isDefault
        };
        
        this.userService.addAddress(this.user.id, addressToSave as any).subscribe({
          next: (savedAddress: any) => {
            if (savedAddress.id) {
              // Map backend response back to frontend format
              const frontendAddress: Address = {
                id: savedAddress.id,
                fullName: savedAddress.fullName || '',
                phone: savedAddress.phone || '',
                addressLine1: (savedAddress as any).line1 || (savedAddress as any).addressLine1 || '',
                addressLine2: (savedAddress as any).line2 || (savedAddress as any).addressLine2 || '',
                city: savedAddress.city || '',
                state: savedAddress.state || '',
                zipCode: (savedAddress as any).postalCode || (savedAddress as any).zipCode || '',
                country: savedAddress.country || '',
                isDefault: savedAddress.isDefault || false
              };
              
              // Also update local user object
              this.authService.addAddress(frontendAddress);
              this.selectedAddress = frontendAddress;
              console.log('Address saved to database:', savedAddress);
            } else {
              // Fallback to local storage only
              this.authService.addAddress(this.newAddress);
              this.selectedAddress = this.newAddress;
              console.warn('Address saved locally only');
            }
          },
          error: (error) => {
            console.error('Error saving address to database:', error);
            // Fallback to local storage
            this.authService.addAddress(this.newAddress);
            this.selectedAddress = this.newAddress;
            console.warn('Address saved locally only due to error');
          }
        });
      } else {
        // Anonymous users: use address directly
        this.selectedAddress = this.newAddress;
      }
      this.showNewAddressForm = false;
      this.resetNewAddress();
    }
  }

  addNewPaymentMethod() {
    if (this.validatePaymentMethod()) {
      if (this.user && this.shouldSaveToDatabase(this.newPaymentMethod.type)) {
        // Only save payment methods that have meaningful data to store
        const { provider, token, displayName } = this.getPaymentMethodData(this.newPaymentMethod);
        
        this.userService.addPaymentMethod(this.user.id, provider, token).subscribe(savedMethod => {
          if (savedMethod.id) {
            // Convert backend format to frontend format
            const frontendMethod: PaymentMethod = {
              id: savedMethod.id,
              type: this.newPaymentMethod.type,
              cardNumber: this.newPaymentMethod.cardNumber,
              cardHolder: this.newPaymentMethod.cardHolder,
              expiryMonth: this.newPaymentMethod.expiryMonth,
              expiryYear: this.newPaymentMethod.expiryYear,
              upiId: this.newPaymentMethod.upiId,
              bnplProvider: this.newPaymentMethod.bnplProvider,
              isDefault: this.newPaymentMethod.isDefault
            };
            
            // Also update local user object
            this.authService.addPaymentMethod(frontendMethod);
            this.selectedPaymentMethod = frontendMethod;
            console.log(`${this.newPaymentMethod.type.toUpperCase()} payment method saved to database:`, savedMethod);
          } else {
            // Fallback to local storage only
            this.authService.addPaymentMethod(this.newPaymentMethod);
            this.selectedPaymentMethod = this.newPaymentMethod;
            console.warn('Payment method saved locally only');
          }
        });
      } else {
        // COD, BNPL, or anonymous users: use directly (no database storage needed)
        if (this.user) {
          this.authService.addPaymentMethod(this.newPaymentMethod);
        }
        this.selectedPaymentMethod = this.newPaymentMethod;
        console.log(`${this.newPaymentMethod.type.toUpperCase()} payment method selected (no database storage needed)`);
      }
      this.showNewPaymentForm = false;
      this.resetNewPaymentMethod();
    }
  }

  private shouldSaveToDatabase(paymentType: string): boolean {
    // Only save payment methods that have meaningful data to persist
    switch (paymentType) {
      case 'card':
        return true;  // Cards have tokenized data worth saving
      case 'upi':
        return true;  // UPI IDs are worth saving for convenience
      case 'cod':
        return false; // COD has no data to save
      case 'bnpl':
        return false; // BNPL provider selection doesn't need persistence
      default:
        return false;
    }
  }

  private getPaymentMethodData(paymentMethod: PaymentMethod): { provider: string, token: string, displayName: string } {
    switch (paymentMethod.type) {
      case 'card':
        const provider = this.getCardProvider(paymentMethod.cardNumber || '');
        const token = this.generateCardToken(paymentMethod.cardNumber || '');
        const displayName = `${provider} ending in ${(paymentMethod.cardNumber || '').slice(-4)}`;
        return { provider, token, displayName };
        
      case 'upi':
        return {
          provider: 'UPI',
          token: `upi_${Date.now()}_${this.hashUpiId(paymentMethod.upiId || '')}`,
          displayName: `UPI: ${this.maskUpiId(paymentMethod.upiId || '')}`
        };
        
      default:
        // This shouldn't be called for COD/BNPL, but just in case
        return {
          provider: paymentMethod.type.toUpperCase(),
          token: `${paymentMethod.type}_${Date.now()}`,
          displayName: paymentMethod.type.toUpperCase()
        };
    }
  }

  private hashUpiId(upiId: string): string {
    // Simple hash for UPI ID (in production, use proper hashing)
    return btoa(upiId).substring(0, 8);
  }

  private maskUpiId(upiId: string): string {
    // Mask UPI ID for display (show first 3 chars and domain)
    if (upiId.includes('@')) {
      const [username, domain] = upiId.split('@');
      if (username.length > 3) {
        return `${username.substring(0, 3)}***@${domain}`;
      }
    }
    return upiId;
  }

  private getCardProvider(cardNumber: string): string {
    const firstDigit = cardNumber.charAt(0);
    const firstTwoDigits = cardNumber.substring(0, 2);
    
    if (firstDigit === '4') return 'VISA';
    if (firstTwoDigits >= '51' && firstTwoDigits <= '55') return 'MASTERCARD';
    if (firstTwoDigits === '34' || firstTwoDigits === '37') return 'AMEX';
    return 'CARD';
  }

  private generateCardToken(cardNumber: string): string {
    // Generate a secure token (in production, this should be done by a payment processor)
    const lastFour = cardNumber.slice(-4);
    const timestamp = Date.now();
    return `card_${timestamp}_${lastFour}`;
  }

  validateAddress(): boolean {
    return !!(this.newAddress.fullName && this.newAddress.phone && 
              this.newAddress.addressLine1 && this.newAddress.city && 
              this.newAddress.state && this.newAddress.zipCode);
  }

  validatePaymentMethod(): boolean {
    switch (this.newPaymentMethod.type) {
      case 'card':
        return !!(this.newPaymentMethod.cardNumber && this.newPaymentMethod.cardHolder && 
                  this.newPaymentMethod.expiryMonth && this.newPaymentMethod.expiryYear);
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
      this.orderService.createOrder(this.selectedAddress, this.selectedPaymentMethod).subscribe({
        next: (order) => {
          // Cart is already cleared in OrderService, just navigate
          this.router.navigate(['/profile'], { queryParams: { tab: 'orders', orderId: order.id } });
        },
        error: (error) => {
          console.error('Error placing order:', error);
          alert('Failed to place order. Please try again.');
        }
      });
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
    return Number((this.getSubtotal() * 0.18).toFixed(2));
  }

  getTotal(): number {
    return Number((this.getSubtotal() + this.getShipping() + this.getTax() - this.getTotalDiscount()).toFixed(2));
  }

  formatPrice(price: number): string {
    const numPrice = Number(price) || 0;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(numPrice);
  }

  formatCardNumber(cardNumber: string): string {
    return '**** **** **** ' + cardNumber.slice(-4);
  }
}
