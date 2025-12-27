import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product, Review } from '../../services/models';
import { ProductService, ReviewRequest } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, KeyValuePipe],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined;
  selectedImageIndex = 0;
  quantity = 1;
  activeTab: 'description' | 'specifications' | 'reviews' = 'description';
  newReview = {
    rating: 5,
    title: '',
    comment: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(+id);
    } else {
      this.router.navigate(['/products']);
    }
  }

  loadProduct(id: number) {
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.router.navigate(['/products']);
      }
    });
  }

  submitReview() {
    if (!this.product || !this.newReview.title || !this.newReview.comment) {
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      // Redirect to login if not authenticated
      this.router.navigate(['/login']);
      return;
    }

    const reviewRequest: ReviewRequest = {
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      rating: this.newReview.rating,
      title: this.newReview.title,
      comment: this.newReview.comment,
      verifiedPurchase: false // This should be checked against order history
    };

    this.productService.createReview(this.product.id, reviewRequest).subscribe({
      next: (review) => {
        // Reload product to get updated reviews
        this.loadProduct(this.product!.id);
        // Reset form
        this.newReview = {
          rating: 5,
          title: '',
          comment: ''
        };
      },
      error: (error) => {
        console.error('Error submitting review:', error);
      }
    });
  }

  addToCart() {
    if (this.product) {
      this.cartService.addToCart(this.product, this.quantity);
    }
  }

  addToWishlist() {
    if (this.product) {
      const isInWishlist = this.authService.isInWishlist(this.product.id);
      if (isInWishlist) {
        this.authService.removeFromWishlist(this.product.id);
      } else {
        this.authService.addToWishlist(this.product.id);
      }
    }
  }

  isInWishlist(): boolean {
    if (this.product) {
      return this.authService.isInWishlist(this.product.id);
    }
    return false;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  increaseQuantity() {
    if (this.product && this.quantity < this.product.stockCount) {
      this.quantity++;
    }
  }

  selectImage(index: number) {
    this.selectedImageIndex = index;
  }

  setTab(tab: 'description' | 'specifications' | 'reviews') {
    this.activeTab = tab;
  }
}
