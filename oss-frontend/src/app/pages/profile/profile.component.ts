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
      this.userService.removeFromWishlist(this.user.id, productId).subscribe(() => {
        this.authService.removeFromWishlist(productId);
        this.loadWishlist();
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
          this.user.paymentMethods = methods;
          this.authService.updateUser(this.user);
        }
      });
    }
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
      // Call backend API to delete payment method
      alert('Payment method deletion functionality to be implemented');
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-IN', {
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
