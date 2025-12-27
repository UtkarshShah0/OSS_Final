import { Component, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product, Category } from '../../services/models';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { SearchPipe } from '../../shared/search-pipe.pipe';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SearchPipe],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  searchQuery = '';
  selectedCategory: string = '';
  priceRange = { min: 0, max: 500000 };
  selectedBrands: string[] = [];
  sortBy = 'default';

  brands: string[] = [];
  minPrice = 0;
  maxPrice = 500000;
  currentPrice = 500000;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();

    // Handle query params
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['search'] || '';
      this.selectedCategory = params['category'] || '';
      this.applyFilters();
    });
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = products;
        this.brands = [...new Set(products.map(p => p.brand).filter(b => b))];
        if (products.length > 0) {
          this.maxPrice = Math.max(...products.map(p => p.price));
          this.priceRange.max = this.maxPrice;
          this.currentPrice = this.maxPrice;
        }
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.products = [];
        this.filteredProducts = [];
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

  applyFilters() {
    let filtered = [...this.products];

    // Category filter
    if (this.selectedCategory) {
      const category = this.categories.find(c => c.slug === this.selectedCategory);
      if (category) {
        filtered = filtered.filter(p => 
          p.categories?.some(c => c.toLowerCase() === category.name.toLowerCase())
        );
      }
    }

    // Search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query)) ||
        (p.brand && p.brand.toLowerCase().includes(query))
      );
    }

    // Brand filter
    if (this.selectedBrands.length > 0) {
      filtered = filtered.filter(p => this.selectedBrands.includes(p.brand));
    }

    // Price filter
    filtered = filtered.filter(p => p.price >= this.priceRange.min && p.price <= this.currentPrice);

    // Sort
    this.sortProducts(filtered);
    this.filteredProducts = filtered;
  }

  sortProducts(products: Product[]) {
    switch (this.sortBy) {
      case 'price-low':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        products.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        products.sort((a, b) => b.id - a.id);
        break;
      default:
        break;
    }
  }

  toggleBrand(brand: string) {
    const index = this.selectedBrands.indexOf(brand);
    if (index > -1) {
      this.selectedBrands.splice(index, 1);
    } else {
      this.selectedBrands.push(brand);
    }
    this.applyFilters();
  }

  onPriceChange() {
    this.priceRange.max = this.currentPrice;
    this.applyFilters();
  }

  onSortChange() {
    this.applyFilters();
  }

  clearFilters() {
    this.selectedCategory = '';
    this.selectedBrands = [];
    this.currentPrice = this.maxPrice;
    this.priceRange.max = this.maxPrice;
    this.searchQuery = '';
    this.sortBy = 'default';
    this.router.navigate(['/products']);
    this.applyFilters();
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

  selectCategory(categorySlug: string) {
    this.selectedCategory = categorySlug;
    this.router.navigate(['/products'], { queryParams: { category: categorySlug } });
    this.applyFilters();
  }
}
