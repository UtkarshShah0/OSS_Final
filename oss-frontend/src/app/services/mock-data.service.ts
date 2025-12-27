import { Injectable } from '@angular/core';

// Deprecated: mock-data.service.ts replaced by models.ts and ProductService.
// Keep a small runtime guard so accidental injection surfaces a clear error.

@Injectable({ providedIn: 'root' })
export class MockDataService {
  constructor() {
    console.warn('MockDataService is deprecated. Use ProductService and models.ts instead.');
  }
}
  icon: string;
  image: string;
  productCount: number;
}

export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  orders: Order[];
  wishlist: number[];
}

export interface Address {
  id: number;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: number;
  type: 'card' | 'wallet' | 'bank';
  cardNumber?: string;
  cardHolder?: string;
  expiryMonth?: number;
  expiryYear?: number;
  walletType?: 'apple' | 'google' | 'paypal';
  isDefault: boolean;
}

export interface Order {
  id: string;
  date: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export interface OrderItem {
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  
  categories: Category[] = [
    { id: 1, name: 'Electronics', slug: 'electronics', icon: '📱', image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&q=80', productCount: 45 },
    { id: 2, name: 'Fashion', slug: 'fashion', icon: '👕', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80', productCount: 120 },
    { id: 3, name: 'Home & Living', slug: 'home-living', icon: '🏠', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80', productCount: 89 },
    { id: 4, name: 'Sports', slug: 'sports', icon: '⚽', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80', productCount: 67 },
    { id: 5, name: 'Books', slug: 'books', icon: '📚', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80', productCount: 234 },
    { id: 6, name: 'Beauty', slug: 'beauty', icon: '💄', image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&q=80', productCount: 56 },
  ];

  products: Product[] = [
    {
      id: 1,
      name: 'iPhone 15 Pro Max',
      description: 'The most advanced iPhone ever. Featuring A17 Pro chip, Titanium design, and ProCamera system.',
      price: 134999,
      originalPrice: 149999,
      discount: 10,
      rating: 4.8,
      reviewCount: 2456,
      images: [
        'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=80',
        'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&q=80',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80'
      ],
      category: 'Electronics',
      brand: 'Apple',
      inStock: true,
      stockCount: 45,
      specifications: {
        'Storage': '256GB',
        'Color': 'Natural Titanium',
        'Display': '6.7-inch Super Retina XDR',
        'Chip': 'A17 Pro'
      },
      tags: ['New', 'Best Seller', 'Premium'],
      reviews: [
        {
          id: 1,
          userId: 1,
          userName: 'John Doe',
          rating: 5,
          title: 'Amazing phone!',
          comment: 'Love the new titanium design and the camera is incredible. Battery life is excellent too.',
          date: '2024-01-15',
          verifiedPurchase: true,
          helpful: 234
        },
        {
          id: 2,
          userId: 2,
          userName: 'Jane Smith',
          rating: 4,
          title: 'Great upgrade',
          comment: 'Upgraded from iPhone 13. The performance improvement is noticeable. Only wish it had more storage.',
          date: '2024-01-10',
          verifiedPurchase: true,
          helpful: 189
        }
      ]
    },
    {
      id: 2,
      name: 'MacBook Pro 16" M3 Max',
      description: 'The most powerful MacBook Pro ever. M3 Max chip with up to 16-core CPU and 40-core GPU.',
      price: 349999,
      originalPrice: 379999,
      discount: 8,
      rating: 4.9,
      reviewCount: 1234,
      images: [
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80'
      ],
      category: 'Electronics',
      brand: 'Apple',
      inStock: true,
      stockCount: 12,
      specifications: {
        'Chip': 'M3 Max',
        'RAM': '36GB',
        'Storage': '1TB SSD',
        'Display': '16.2-inch Liquid Retina XDR'
      },
      tags: ['Premium', 'Professional'],
      reviews: []
    },
    {
      id: 3,
      name: 'Sony WH-1000XM5 Wireless Headphones',
      description: 'Industry-leading noise cancellation with premium sound quality and 30-hour battery life.',
      price: 29999,
      originalPrice: 34999,
      discount: 14,
      rating: 4.7,
      reviewCount: 3456,
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80'
      ],
      category: 'Electronics',
      brand: 'Sony',
      inStock: true,
      stockCount: 78,
      specifications: {
        'Type': 'Over-ear',
        'Battery': '30 hours',
        'Noise Cancelling': 'Yes',
        'Connectivity': 'Bluetooth 5.2'
      },
      tags: ['Best Seller', 'Premium Audio'],
      reviews: []
    },
    {
      id: 4,
      name: 'Samsung 65" 4K QLED Smart TV',
      description: 'Quantum Dot technology delivers a billion shades of color. Smart TV with voice control.',
      price: 129999,
      originalPrice: 159999,
      discount: 19,
      rating: 4.6,
      reviewCount: 1890,
      images: [
        'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80',
        'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&q=80'
      ],
      category: 'Electronics',
      brand: 'Samsung',
      inStock: true,
      stockCount: 23,
      specifications: {
        'Screen Size': '65 inch',
        'Resolution': '4K UHD',
        'Smart Platform': 'Tizen',
        'HDR': 'HDR10+'
      },
      tags: ['4K', 'Smart TV'],
      reviews: []
    },
    {
      id: 5,
      name: 'Nike Air Max 270',
      description: 'Iconic Air Max cushioning meets modern style. Perfect for everyday wear.',
      price: 8999,
      originalPrice: 11999,
      discount: 25,
      rating: 4.5,
      reviewCount: 5678,
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
        'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80'
      ],
      category: 'Fashion',
      brand: 'Nike',
      inStock: true,
      stockCount: 156,
      specifications: {
        'Material': 'Mesh & Synthetic',
        'Sole': 'Rubber',
        'Closure': 'Lace-up'
      },
      tags: ['Trending', 'Sale'],
      reviews: []
    },
    {
      id: 6,
      name: 'Levi\'s 501 Original Fit Jeans',
      description: 'The original button-fly jeans. Classic straight-leg fit that never goes out of style.',
      price: 3999,
      originalPrice: 5999,
      discount: 33,
      rating: 4.4,
      reviewCount: 4321,
      images: [
        'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',
        'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80'
      ],
      category: 'Fashion',
      brand: 'Levi\'s',
      inStock: true,
      stockCount: 234,
      specifications: {
        'Fit': 'Original',
        'Material': '100% Cotton',
        'Wash': 'Dark Blue'
      },
      tags: ['Classic', 'Sale'],
      reviews: []
    },
    {
      id: 7,
      name: 'Dyson V15 Detect Cordless Vacuum',
      description: 'Advanced laser technology reveals microscopic dust. Up to 60 minutes of runtime.',
      price: 54999,
      originalPrice: 59999,
      discount: 8,
      rating: 4.8,
      reviewCount: 987,
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80'
      ],
      category: 'Home & Living',
      brand: 'Dyson',
      inStock: true,
      stockCount: 34,
      specifications: {
        'Type': 'Cordless',
        'Runtime': '60 minutes',
        'Dust Capacity': '0.77L',
        'Weight': '3kg'
      },
      tags: ['Premium', 'Best Seller'],
      reviews: []
    },
    {
      id: 8,
      name: 'IKEA HEMNES Bed Frame',
      description: 'Scandinavian design bed frame in solid wood. Creates a calm and welcoming feeling.',
      price: 24999,
      originalPrice: 28999,
      discount: 14,
      rating: 4.3,
      reviewCount: 654,
      images: [
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80'
      ],
      category: 'Home & Living',
      brand: 'IKEA',
      inStock: true,
      stockCount: 18,
      specifications: {
        'Material': 'Solid Pine Wood',
        'Size': 'Queen (160x200cm)',
        'Color': 'White Stain'
      },
      tags: ['Popular', 'Sale'],
      reviews: []
    },
    {
      id: 9,
      name: 'Wilson Pro Staff Tennis Racket',
      description: 'Professional-grade tennis racket used by champions. Perfect balance of power and control.',
      price: 14999,
      originalPrice: 17999,
      discount: 17,
      rating: 4.6,
      reviewCount: 1234,
      images: [
        'https://images.unsplash.com/photo-1622163642992-5c25844a83c0?w=800&q=80',
        'https://images.unsplash.com/photo-1534158914592-062992fbe900?w=800&q=80'
      ],
      category: 'Sports',
      brand: 'Wilson',
      inStock: true,
      stockCount: 67,
      specifications: {
        'Weight': '300g',
        'Head Size': '97 sq in',
        'String Pattern': '16x19'
      },
      tags: ['Professional', 'Premium'],
      reviews: []
    },
    {
      id: 10,
      name: 'The Seven Husbands of Evelyn Hugo',
      description: 'A captivating novel about a reclusive Hollywood icon who finally decides to tell her story.',
      price: 599,
      originalPrice: 799,
      discount: 25,
      rating: 4.7,
      reviewCount: 56789,
      images: [
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80',
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80'
      ],
      category: 'Books',
      brand: 'Atria Books',
      inStock: true,
      stockCount: 456,
      specifications: {
        'Format': 'Paperback',
        'Pages': '400',
        'Language': 'English'
      },
      tags: ['Bestseller', 'Fiction'],
      reviews: []
    },
    {
      id: 11,
      name: 'L\'Oreal Paris Revitalift Anti-Aging Cream',
      description: 'Advanced anti-aging formula with Pro-Retinol A. Reduces wrinkles and fine lines.',
      price: 1299,
      originalPrice: 1799,
      discount: 28,
      rating: 4.4,
      reviewCount: 2345,
      images: [
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80',
        'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800&q=80'
      ],
      category: 'Beauty',
      brand: 'L\'Oreal Paris',
      inStock: true,
      stockCount: 189,
      specifications: {
        'Volume': '50ml',
        'Skin Type': 'All Types',
        'SPF': 'No'
      },
      tags: ['Anti-Aging', 'Popular'],
      reviews: []
    },
    {
      id: 12,
      name: 'Apple Watch Series 9',
      description: 'The most advanced Apple Watch. Features S9 chip, brighter display, and Double Tap gesture.',
      price: 41999,
      originalPrice: 45999,
      discount: 9,
      rating: 4.8,
      reviewCount: 3456,
      images: [
        'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&q=80',
        'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=800&q=80'
      ],
      category: 'Electronics',
      brand: 'Apple',
      inStock: true,
      stockCount: 89,
      specifications: {
        'Size': '45mm',
        'Material': 'Aluminum',
        'Band': 'Sport Band',
        'GPS': 'Yes'
      },
      tags: ['New', 'Best Seller'],
      reviews: []
    }
  ];

  constructor() { }

  getProducts(): Product[] {
    return this.products;
  }

  getProductById(id: number): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  getProductsByCategory(category: string): Product[] {
    return this.products.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  getCategories(): Category[] {
    return this.categories;
  }

  searchProducts(query: string): Product[] {
    const lowerQuery = query.toLowerCase();
    return this.products.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.brand.toLowerCase().includes(lowerQuery) ||
      p.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }
}

