import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
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
    private orderService: OrderService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();

    if (this.user) {
      this.editedName = this.user.name;
      this.editedEmail = this.user.email;
      this.editedPhone = this.user.phone || '';
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
    this.orderService.getOrders().subscribe(orders => {
      this.orders = orders;
    });
  }

  loadWishlist() {
    if (this.user) {
      // fetch all products, then filter by wishlist ids
      this.productService.getAllProducts().subscribe(products => {
        this.wishlistProducts = products.filter(p => this.user!.wishlist.includes(p.id));
      }, err => {
        console.error('Error loading wishlist products', err);
        this.wishlistProducts = [];
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
    this.authService.removeFromWishlist(productId);
    this.loadWishlist();
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
