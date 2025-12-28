# Frontend Architecture - Angular 18 E-Commerce Application

## 🏗️ Architecture Overview

The frontend is built using **Angular 18** with a modern, component-based architecture following Angular best practices.

```
┌─────────────────────────────────────────────────────────────┐
│                    Angular 18 Frontend                     │
├─────────────────┬─────────────────┬─────────────────────────┤
│     Pages       │    Services     │       Shared            │
│   Components    │   (API Layer)   │     Components          │
├─────────────────┼─────────────────┼─────────────────────────┤
│ • Home          │ • Auth Service  │ • Guards               │
│ • Products      │ • User Service  │ • Pipes                │
│ • Cart          │ • Cart Service  │ • Models               │
│ • Checkout      │ • Order Service │ • Utilities            │
│ • Profile       │ • Product Svc   │                        │
│ • Login/Register│                 │                        │
└─────────────────┴─────────────────┴─────────────────────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │    API Gateway      │
                 │   (Port 9090)       │
                 └─────────────────────┘
```

## 📁 Project Structure

```
src/
├── app/
│   ├── pages/                    # Page Components
│   │   ├── home/                 # Home page
│   │   ├── products/             # Product listing
│   │   ├── product-detail/       # Product details
│   │   ├── cart/                 # Shopping cart
│   │   ├── checkout/             # Checkout process
│   │   ├── profile/              # User profile
│   │   ├── login/                # Login page
│   │   └── register/             # Registration page
│   ├── services/                 # API Services
│   │   ├── auth.service.ts       # Authentication
│   │   ├── user.service.ts       # User management
│   │   ├── product.service.ts    # Product operations
│   │   ├── cart.service.ts       # Cart management
│   │   ├── order.service.ts      # Order processing
│   │   └── models.ts             # TypeScript interfaces
│   ├── shared/                   # Shared Components
│   │   ├── guards/               # Route guards
│   │   └── pipes/                # Custom pipes
│   ├── app.component.ts          # Root component
│   ├── app.routes.ts             # Routing configuration
│   └── main.ts                   # Application bootstrap
├── assets/                       # Static assets
├── styles/                       # Global styles
└── index.html                    # Main HTML file
```

## 🧩 Core Components

### 1. Page Components

#### Home Component (`/`)
- **Purpose**: Landing page with featured products
- **Features**: Product carousel, categories, promotions
- **Dependencies**: ProductService

#### Products Component (`/products`)
- **Purpose**: Product listing with filters and search
- **Features**: 
  - Category filtering
  - Price range filtering
  - Brand filtering
  - Search functionality
  - Sorting options
- **Dependencies**: ProductService, CartService

#### Product Detail Component (`/product/:id`)
- **Purpose**: Detailed product view
- **Features**:
  - Product images gallery
  - Specifications display
  - Reviews and ratings
  - Add to cart/wishlist
- **Dependencies**: ProductService, CartService, AuthService

#### Cart Component (`/cart`)
- **Purpose**: Shopping cart management
- **Features**:
  - Item quantity updates
  - Remove items
  - Price calculations
  - Proceed to checkout
- **Dependencies**: CartService

#### Checkout Component (`/checkout`)
- **Purpose**: Multi-step checkout process
- **Features**:
  - Step 1: Shipping address selection/creation
  - Step 2: Payment method selection/creation
  - Step 3: Order review and confirmation
- **Dependencies**: CartService, UserService, OrderService

#### Profile Component (`/profile`)
- **Purpose**: User account management
- **Features**:
  - Order history
  - Address management
  - Payment methods
  - Wishlist
  - Account settings
- **Dependencies**: UserService, AuthService

### 2. Services Layer

#### AuthService
```typescript
class AuthService {
  // User authentication state management
  currentUser$: Observable<User | null>
  
  // Methods
  login(credentials): Observable<User>
  register(userData): Observable<User>
  logout(): void
  getCurrentUser(): User | null
  updateUser(user): void
}
```

#### ProductService
```typescript
class ProductService {
  // Product data management
  getAllProducts(): Observable<Product[]>
  getProductById(id): Observable<Product>
  getCategories(): Observable<Category[]>
  searchProducts(query): Observable<Product[]>
  createReview(productId, review): Observable<Review>
}
```

#### CartService
```typescript
class CartService {
  // Shopping cart state management
  cart$: Observable<CartItem[]>
  
  // Methods
  addToCart(product, quantity): void
  removeFromCart(productId): void
  updateQuantity(productId, quantity): void
  clearCart(): void
  getCartCount(): number
  getSubtotal(): number
}
```

#### UserService
```typescript
class UserService {
  // User data management
  getAddresses(userId): Observable<Address[]>
  addAddress(userId, address): Observable<Address>
  getPaymentMethods(userId): Observable<PaymentMethod[]>
  addPaymentMethod(userId, method): Observable<PaymentMethod>
  getWishlist(userId): Observable<Product[]>
  checkout(userId, addressId, shipping, method): Observable<any>
}
```

#### OrderService
```typescript
class OrderService {
  // Order management
  createOrder(address, paymentMethod): Observable<Order>
  getOrders(): Observable<Order[]>
  getOrderById(orderId): Order | null
  cancelOrder(orderId): boolean
}
```

## 🔄 Data Flow Architecture

### 1. Component-Service Communication
```
Component → Service → HTTP Client → API Gateway → Microservice
    ↑                                                    ↓
    └─────────── Observable Response ←──────────────────┘
```

### 2. State Management
- **Local State**: Component-level state using Angular signals/properties
- **Shared State**: Service-level state using BehaviorSubject/Observable patterns
- **Persistent State**: localStorage for user session and cart data

### 3. Authentication Flow
```
1. User Login → AuthService.login()
2. Store user data in localStorage
3. Update currentUser$ BehaviorSubject
4. Components subscribe to authentication state
5. Route guards protect authenticated routes
```

## 🎨 UI/UX Architecture

### Styling Framework
- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach
- **Component Styling**: Scoped CSS per component

### Design System
```scss
// Color Palette
primary: #3B82F6    // Blue
secondary: #10B981  // Green
accent: #F59E0B     // Amber
neutral: #6B7280    // Gray
error: #EF4444      // Red
```

### Layout Structure
```
┌─────────────────────────────────────┐
│              Header                 │
│  Logo | Navigation | Cart | Profile │
├─────────────────────────────────────┤
│                                     │
│            Main Content             │
│         (Router Outlet)             │
│                                     │
├─────────────────────────────────────┤
│              Footer                 │
│    Links | Social | Newsletter     │
└─────────────────────────────────────┘
```

## 🛡️ Security Implementation

### Authentication Guard
```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem("token");
  return !!token;
};
```

### Route Protection
```typescript
const routes: Routes = [
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard] }
];
```

## 📱 Responsive Design

### Breakpoints
```scss
// Tailwind CSS Breakpoints
sm: 640px   // Small devices
md: 768px   // Medium devices  
lg: 1024px  // Large devices
xl: 1280px  // Extra large devices
```

### Mobile-First Components
- Collapsible navigation menu
- Touch-friendly buttons and inputs
- Optimized product grid layouts
- Swipeable image carousels

## 🔧 Development Tools

### Build Configuration
- **Angular CLI**: Project scaffolding and build tools
- **TypeScript**: Type safety and modern JavaScript features
- **Webpack**: Module bundling (via Angular CLI)
- **PostCSS**: CSS processing with Tailwind

### Development Server
```bash
ng serve --host 0.0.0.0 --port 4200
```

### Build Process
```bash
# Development build
ng build

# Production build
ng build --configuration production
```

## 🧪 Testing Strategy

### Unit Testing
- **Jasmine**: Testing framework
- **Karma**: Test runner
- Component testing with TestBed
- Service testing with HttpClientTestingModule

### E2E Testing
- **Cypress**: End-to-end testing framework
- User journey testing
- Cross-browser compatibility

## 🚀 Performance Optimization

### Lazy Loading
```typescript
const routes: Routes = [
  {
    path: 'products',
    loadComponent: () => import('./pages/products/products.component')
      .then(m => m.ProductsComponent)
  }
];
```

### Image Optimization
- Lazy loading images
- WebP format support
- Responsive image sizes

### Bundle Optimization
- Tree shaking for unused code elimination
- Code splitting by routes
- Minification and compression

## 📊 State Management Patterns

### Service-Based State
```typescript
@Injectable({ providedIn: 'root' })
export class CartService {
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  public cart$ = this.cartSubject.asObservable();
  
  updateCart(items: CartItem[]) {
    this.cartSubject.next(items);
  }
}
```

### Local Storage Integration
```typescript
// Persist cart data
localStorage.setItem('cart', JSON.stringify(cartItems));

// Restore cart data
const stored = localStorage.getItem('cart');
if (stored) {
  this.cartItems = JSON.parse(stored);
}
```

## 🔄 API Integration

### HTTP Interceptors
```typescript
@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Add base URL and headers
    const apiReq = req.clone({
      url: `${API_BASE_URL}${req.url}`
    });
    return next.handle(apiReq);
  }
}
```

### Error Handling
```typescript
catchError((error: HttpErrorResponse) => {
  console.error('API Error:', error);
  return of([]); // Return empty array as fallback
})
```

## 📈 Monitoring and Analytics

### Error Tracking
- Console logging for development
- Error boundary components
- HTTP error interceptors

### Performance Monitoring
- Angular DevTools
- Lighthouse audits
- Bundle analyzer

---

This frontend architecture provides a scalable, maintainable, and user-friendly e-commerce application with modern Angular practices and responsive design principles.