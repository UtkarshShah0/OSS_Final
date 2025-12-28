import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User, Address, PaymentMethod } from '../../services/models';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../services/product.service';
import { Order } from '../../services/models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  activeTab: 'profile' | 'orders' | 'addresses' | 'payments' | 'wishlist' = 'profile';
  orders: Order[] = [];
  wishlistProducts: any[] = [];

  editedName = '';
  editedEmail = '';
  editedPhone = '';

  // Address form
  showNewAddressForm = false;
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

  // Payment method form
  showNewPaymentForm = false;
  newPaymentMethod: PaymentMethod = {
    id: 0,
    type: 'card',
    cardNumber: '',
    cardHolder: '',
    expiryMonth: 0,
    expiryYear: 0,
    isDefault: false
  };

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private orderService: OrderService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();

    if (this.user) {
      this.editedName = this.user.name || '';
      this.editedEmail = this.user.email || '';
      this.editedPhone = this.user.phone || '';
      
      // Load data from backend
      this.loadAddresses();
      this.loadPaymentMethods();
    }

    this.route.queryParams.subscribe(params => {
      const tab = params['tab'];
      if (tab && ['profile', 'orders', 'addresses', 'payments', 'wishlist'].includes(tab)) {
        this.activeTab = tab as any;
      }
    });

    this.loadOrders();
    this.loadWishlist();
  }

  loadOrders() {
    if (this.user) {
      this.userService.getOrders(this.user.id).subscribe(orders => {
        this.orders = orders;
      });
    }
  }

  loadWishlist() {
    if (this.user) {
      this.userService.getWishlist(this.user.id).subscribe(wishlistItems => {
        // Get product details for wishlist items
        const productIds = wishlistItems.map(item => item.productId);
        if (productIds.length > 0) {
          this.productService.getAllProducts().subscribe(products => {
            this.wishlistProducts = products.filter(p => productIds.includes(p.id));
          });
        } else {
          // Clear wishlist products when no items exist
          this.wishlistProducts = [];
        }
      });
    }
  }

  setTab(tab: 'profile' | 'orders' | 'addresses' | 'payments' | 'wishlist') {
    this.activeTab = tab;
    this.router.navigate(['/profile'], { queryParams: { tab } });
  }

  updateProfile() {
    if (this.user) {
      this.user.name = this.editedName;
      this.user.email = this.editedEmail;
      this.user.phone = this.editedPhone;
      this.authService.updateUser(this.user);
      alert('Profile updated successfully!');
    }
  }

  removeFromWishlist(productId: number) {
    if (this.user) {
      this.userService.removeFromWishlist(this.user.id, productId).subscribe({
        next: () => {
          // Update local auth service
          this.authService.removeFromWishlist(productId);
          // Reload wishlist to reflect changes
          this.loadWishlist();
          console.log('Product removed from wishlist successfully');
        },
        error: (error) => {
          console.error('Error removing from wishlist:', error);
          // Still try to reload in case it was actually removed
          this.loadWishlist();
        }
      });
    }
  }

  loadAddresses() {
    if (this.user) {
      this.userService.getAddresses(this.user.id).subscribe(addresses => {
        if (this.user) {
          this.user.addresses = addresses;
          this.authService.updateUser(this.user);
        }
      });
    }
  }

  loadPaymentMethods() {
    if (this.user) {
      this.userService.getPaymentMethods(this.user.id).subscribe(methods => {
        if (this.user) {
          // Map backend payment methods to frontend format
          this.user.paymentMethods = methods.map(method => this.mapBackendPaymentMethodToFrontend(method));
          this.authService.updateUser(this.user);
        }
      });
    }
  }

  private mapBackendPaymentMethodToFrontend(backendMethod: any): PaymentMethod {
    // Extract information from provider and token
    const provider = backendMethod.provider;
    const token = backendMethod.token;
    
    let frontendMethod: PaymentMethod = {
      id: backendMethod.id,
      type: 'card', // default
      isDefault: false
    };

    if (provider === 'CARD') {
      frontendMethod.type = 'card';
      // Extract last 4 digits from token if available
      const lastFourMatch = token.match(/_(\d{4})$/);
      if (lastFourMatch) {
        frontendMethod.cardNumber = '**** **** **** ' + lastFourMatch[1];
      }
      frontendMethod.cardHolder = 'Card Holder'; // We don't store this in backend
    } else if (provider === 'UPI') {
      frontendMethod.type = 'upi';
      frontendMethod.upiId = 'UPI Payment'; // We don't store the actual UPI ID for security
    } else if (provider === 'COD') {
      frontendMethod.type = 'cod';
    } else if (provider === 'BNPL') {
      frontendMethod.type = 'bnpl';
      frontendMethod.bnplProvider = 'Klarna'; // Default, we don't store this
    }

    return frontendMethod;
  }

  editAddress(address: Address) {
    // Navigate to address edit or show modal
    alert('Address editing functionality to be implemented');
  }

  deleteAddress(addressId: number) {
    if (this.user && confirm('Are you sure you want to delete this address?')) {
      this.userService.deleteAddress(this.user.id, addressId).subscribe(() => {
        this.loadAddresses();
      });
    }
  }

  editPaymentMethod(method: PaymentMethod) {
    // Navigate to payment method edit or show modal
    alert('Payment method editing functionality to be implemented');
  }

  deletePaymentMethod(methodId: number) {
    if (this.user && confirm('Are you sure you want to delete this payment method?')) {
      this.userService.deletePaymentMethod(this.user.id, methodId).subscribe(() => {
        // Remove from local user object
        if (this.user) {
          this.user.paymentMethods = this.user.paymentMethods.filter(method => method.id !== methodId);
          this.authService.updateUser(this.user);
        }
        console.log('Payment method deleted successfully');
      });
    }
  }

  // Address management methods
  showAddNewAddressForm() {
    this.showNewAddressForm = true;
  }

  addNewAddress() {
    console.log('addNewAddress called, user:', this.user);
    if (this.validateAddress() && this.user) {
      // Map frontend fields to backend fields (don't send ID, let backend assign it)
      const addressToSave = {
        fullName: this.newAddress.fullName,
        phone: this.newAddress.phone,
        line1: this.newAddress.addressLine1,
        line2: this.newAddress.addressLine2,
        city: this.newAddress.city,
        state: this.newAddress.state,
        postalCode: this.newAddress.zipCode,
        country: this.newAddress.country,
        isDefault: this.newAddress.isDefault
      };

      console.log('Sending address data to backend:', addressToSave);

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

            // Update local user object
            if (this.user) {
              this.user.addresses.push(frontendAddress);
              this.authService.updateUser(this.user);
            }
            
            this.showNewAddressForm = false;
            this.resetNewAddress();
            console.log('Address saved successfully:', savedAddress);
            alert('Address saved successfully!');
          } else {
            alert('Failed to save address. Please try again.');
          }
        },
        error: (error) => {
          console.error('Error saving address:', error);
          alert('Error saving address: ' + (error.error || error.message || 'Unknown error'));
        }
      });
    }
  }

  validateAddress(): boolean {
    console.log('Validating address:', this.newAddress);
    const isValid = !!(this.newAddress.fullName && this.newAddress.phone && 
              this.newAddress.addressLine1 && this.newAddress.city && 
              this.newAddress.state && this.newAddress.zipCode);
    console.log('Address validation result:', isValid);
    return isValid;
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

  cancelAddAddress() {
    this.showNewAddressForm = false;
    this.resetNewAddress();
  }

  // Payment method management methods
  showAddNewPaymentForm() {
    this.showNewPaymentForm = true;
  }

  addNewPaymentMethod() {
    if (this.validatePaymentMethod() && this.user) {
      if (this.shouldSaveToDatabase(this.newPaymentMethod.type)) {
        const { provider, token, displayName } = this.getPaymentMethodData(this.newPaymentMethod);
        
        this.userService.addPaymentMethod(this.user.id, provider, token).subscribe(savedMethod => {
          if (savedMethod.id) {
            // Add to local user object
            if (this.user) {
              this.user.paymentMethods.push(this.newPaymentMethod);
              this.authService.updateUser(this.user);
            }
            
            this.showNewPaymentForm = false;
            this.resetNewPaymentMethod();
            console.log('Payment method saved successfully:', savedMethod);
          } else {
            alert('Failed to save payment method. Please try again.');
          }
        });
      } else {
        // For COD/BNPL, just add to local storage
        if (this.user) {
          this.user.paymentMethods.push(this.newPaymentMethod);
          this.authService.updateUser(this.user);
        }
        
        this.showNewPaymentForm = false;
        this.resetNewPaymentMethod();
        console.log('Payment method added locally:', this.newPaymentMethod.type);
      }
    }
  }

  private shouldSaveToDatabase(paymentType: string): boolean {
    return paymentType === 'card' || paymentType === 'upi';
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
        return { provider: 'UNKNOWN', token: 'unknown', displayName: 'Unknown' };
    }
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
    const lastFour = cardNumber.slice(-4);
    const timestamp = Date.now();
    return `card_${timestamp}_${lastFour}`;
  }

  private hashUpiId(upiId: string): string {
    return btoa(upiId).substring(0, 8);
  }

  private maskUpiId(upiId: string): string {
    if (upiId.includes('@')) {
      const [username, domain] = upiId.split('@');
      if (username.length > 3) {
        return `${username.substring(0, 3)}***@${domain}`;
      }
    }
    return upiId;
  }

  validatePaymentMethod(): boolean {
    switch (this.newPaymentMethod.type) {
      case 'card':
        return !!(this.newPaymentMethod.cardNumber && this.newPaymentMethod.cardHolder && 
                  this.newPaymentMethod.expiryMonth && this.newPaymentMethod.expiryYear);
      case 'upi':
        return !!this.newPaymentMethod.upiId;
      case 'cod':
      case 'bnpl':
        return true;
      default:
        return false;
    }
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

  cancelAddPaymentMethod() {
    this.showNewPaymentForm = false;
    this.resetNewPaymentMethod();
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

  formatDate(dateString: string): string {
    if (!dateString) return 'Invalid Date';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'processing': 'bg-purple-100 text-purple-800',
      'shipped': 'bg-indigo-100 text-indigo-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }
}
