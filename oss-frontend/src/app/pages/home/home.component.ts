import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Product, Category } from '../../services/models';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];
  categories: Category[] = [];
  
  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.loadFeaturedProducts();
    this.loadCategories();
  }

  loadFeaturedProducts() {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        // Get top 8 products, sorted by rating or popularity
        this.featuredProducts = products
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 8);
      },
      error: (error) => {
        console.error('Error loading featured products:', error);
        this.featuredProducts = [];
      }
    });
  }

  loadCategories() {
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.categories = [];
      }
    });
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product, 1);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  }
}
