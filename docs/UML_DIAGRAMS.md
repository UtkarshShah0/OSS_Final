# UML Diagrams - E-Commerce Platform

## 🎯 Overview

This document contains comprehensive UML diagrams for the e-commerce microservices platform, including system architecture, workflows, and detailed service interactions.

---

## 🏗️ System Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        A[Angular Frontend<br/>Port 4200]
    end
    
    subgraph "API Gateway Layer"
        B[Spring Cloud Gateway<br/>Port 9090]
    end
    
    subgraph "Service Discovery"
        C[Eureka Server<br/>Port 8761]
    end
    
    subgraph "Microservices Layer"
        D[User Service<br/>Port 8089]
        E[Product Catalog<br/>Port 8082]
        F[Cart Service<br/>Port 8085]
        G[Order Management<br/>Port 8084]
        H[Payment Service<br/>Port 8765]
    end
    
    subgraph "Data Layer"
        I[(MySQL Database<br/>Port 3306)]
    end
    
    A --> B
    B --> D
    B --> E
    B --> F
    B --> G
    B --> H
    
    D --> C
    E --> C
    F --> C
    G --> C
    H --> C
    
    D --> I
    E --> I
    F --> I
    G --> I
    H --> I
    
    F -.-> E
    G -.-> E
    G -.-> D
```

---

## 🔄 User Journey Workflow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant G as API Gateway
    participant US as User Service
    participant PS as Product Service
    participant CS as Cart Service
    participant OS as Order Service
    participant DB as Database
    
    Note over U,DB: User Registration & Login
    U->>F: Register/Login
    F->>G: POST /auth/register
    G->>US: Forward request
    US->>DB: Store user data
    DB-->>US: User created
    US-->>G: User response
    G-->>F: User data
    F-->>U: Login success
    
    Note over U,DB: Product Browsing
    U->>F: Browse products
    F->>G: GET /api/products
    G->>PS: Forward request
    PS->>DB: Query products
    DB-->>PS: Product data
    PS-->>G: Product list
    G-->>F: Products with images
    F-->>U: Display products
    
    Note over U,DB: Add to Cart
    U->>F: Add to cart
    F->>G: POST /cart/{userId}/items
    G->>CS: Forward request
    CS->>DB: Store cart item
    DB-->>CS: Item added
    CS-->>G: Cart updated
    G-->>F: Success response
    F-->>U: Item added confirmation
    
    Note over U,DB: Checkout Process
    U->>F: Proceed to checkout
    F->>G: POST /checkout
    G->>CS: Process checkout
    CS->>PS: Reduce inventory
    PS->>DB: Update stock
    CS->>OS: Create order
    OS->>DB: Store order
    CS->>DB: Clear cart
    CS-->>G: Order created
    G-->>F: Order confirmation
    F-->>U: Order success
```

---

## 🏛️ Microservices Architecture

```mermaid
graph TB
    subgraph "Frontend"
        FE[Angular 18 Application]
    end
    
    subgraph "API Gateway"
        GW[Spring Cloud Gateway<br/>- Request Routing<br/>- Load Balancing<br/>- CORS Handling]
    end
    
    subgraph "Service Registry"
        SR[Eureka Server<br/>- Service Discovery<br/>- Health Monitoring<br/>- Load Balancing]
    end
    
    subgraph "User Domain"
        US[User Service<br/>- Authentication<br/>- Profile Management<br/>- Address & Payment<br/>- Wishlist]
        UDB[(User Database<br/>- users<br/>- addresses<br/>- payment_methods<br/>- wishlist)]
    end
    
    subgraph "Product Domain"
        PS[Product Catalog<br/>- Product Management<br/>- Categories<br/>- Reviews<br/>- Inventory]
        PDB[(Product Database<br/>- products<br/>- categories<br/>- reviews<br/>- product_images)]
    end
    
    subgraph "Cart Domain"
        CS[Cart Service<br/>- Cart Management<br/>- Checkout Process<br/>- Price Calculation]
        CDB[(Cart Database<br/>- cart<br/>- cart_item)]
    end
    
    subgraph "Order Domain"
        OS[Order Management<br/>- Order Processing<br/>- Order History<br/>- Status Tracking<br/>- Email Notifications]
        ODB[(Order Database<br/>- orders<br/>- order_item)]
    end
    
    FE --> GW
    GW --> US
    GW --> PS
    GW --> CS
    GW --> OS
    
    US --> SR
    PS --> SR
    CS --> SR
    OS --> SR
    
    US --> UDB
    PS --> PDB
    CS --> CDB
    OS --> ODB
    
    CS -.->|Product Info| PS
    OS -.->|User Info| US
    OS -.->|Inventory Update| PS
```

---

## 📊 Class Diagram - User Service

```mermaid
classDiagram
    class User {
        -Long id
        -String email
        -String phone
        -String password
        -String name
        -String avatar
        -Boolean mfaEnabled
        -LocalDateTime createdAt
        -LocalDateTime updatedAt
        +getId() Long
        +setEmail(String) void
        +validatePassword(String) boolean
    }
    
    class Address {
        -Long id
        -Long userId
        -String fullName
        -String phone
        -String line1
        -String line2
        -String city
        -String state
        -String postalCode
        -String country
        -Boolean isDefault
        +getFullAddress() String
        +setAsDefault() void
    }
    
    class PaymentMethod {
        -Long id
        -Long userId
        -String provider
        -String token
        -Boolean isDefault
        -LocalDateTime createdAt
        +maskToken() String
        +isExpired() boolean
    }
    
    class Wishlist {
        -Long id
        -Long userId
        -Long productId
        -LocalDateTime createdAt
        +isProductInWishlist(Long) boolean
    }
    
    class AuthController {
        -AuthService authService
        +register(RegisterRequest) ResponseEntity
        +login(LoginRequest) ResponseEntity
        +verifyOtp(OtpRequest) ResponseEntity
    }
    
    class UserController {
        -UserService userService
        +getAddresses(Long) ResponseEntity
        +addAddress(Long, Address) ResponseEntity
        +getPaymentMethods(Long) ResponseEntity
        +addPaymentMethod(Long, PaymentMethod) ResponseEntity
        +getWishlist(Long) ResponseEntity
        +addToWishlist(Long, Long) ResponseEntity
    }
    
    User ||--o{ Address : has
    User ||--o{ PaymentMethod : has
    User ||--o{ Wishlist : has
    AuthController --> User : manages
    UserController --> User : manages
    UserController --> Address : manages
    UserController --> PaymentMethod : manages
    UserController --> Wishlist : manages
```

---

## 📦 Class Diagram - Product Catalog

```mermaid
classDiagram
    class Product {
        -Long id
        -String sku
        -String name
        -String brand
        -String description
        -BigDecimal price
        -String currency
        -Integer stock
        -AvailabilityStatus availabilityStatus
        -Boolean active
        -Map~String,String~ specifications
        -Set~Category~ categories
        -List~ProductImage~ images
        -List~Review~ reviews
        +reduceStock(Integer) boolean
        +isAvailable() boolean
        +getAverageRating() Double
    }
    
    class Category {
        -Long id
        -String name
        -String description
        -Set~Product~ products
        +getProductCount() Integer
    }
    
    class ProductImage {
        -Long id
        -byte[] imageData
        -String imageUrl
        -String contentType
        -String altText
        -Integer sortOrder
        -Product product
        +getImageUrl() String
        +hasImageData() boolean
    }
    
    class Review {
        -Long id
        -Long productId
        -Long userId
        -String userName
        -String userAvatar
        -Integer rating
        -String title
        -String comment
        -Boolean verifiedPurchase
        -Integer helpfulCount
        -LocalDateTime createdAt
        +isPositive() boolean
        +getFormattedDate() String
    }
    
    class ProductController {
        -ProductService productService
        +getAllProducts() ResponseEntity
        +getProductById(Long) ResponseEntity
        +reduceStock(Long, Integer) ResponseEntity
        +uploadImage(Long, MultipartFile) ResponseEntity
        +getImage(Long) ResponseEntity
    }
    
    Product }|--|| Category : belongs to
    Product ||--o{ ProductImage : has
    Product ||--o{ Review : has
    ProductController --> Product : manages
```

---

## 🛒 Class Diagram - Cart Service

```mermaid
classDiagram
    class Cart {
        -Long id
        -Long userId
        -List~CartItem~ items
        -Instant updatedAt
        +addItem(CartItem) void
        +removeItem(Long) void
        +updateQuantity(Long, Integer) void
        +clear() void
        +getTotalItems() Integer
    }
    
    class CartItem {
        -Long id
        -Cart cart
        -Long productId
        -Integer quantity
        -String variant
        -Instant createdAt
        -Instant updatedAt
        +getLineTotal(BigDecimal) BigDecimal
        +updateQuantity(Integer) void
    }
    
    class CartController {
        -CartService cartService
        -PricingService pricingService
        +getCart(Long) ResponseEntity
        +addItem(Long, Long, Integer, String) ResponseEntity
        +updateItem(Long, Long, Integer) ResponseEntity
        +removeItem(Long, Long) ResponseEntity
        +getPrice(Long) ResponseEntity
    }
    
    class CheckoutController {
        -CheckoutService checkoutService
        +checkout(Long, Long, String, String) ResponseEntity
    }
    
    class PriceDto {
        -BigDecimal subtotal
        -BigDecimal tax
        -BigDecimal shipping
        -BigDecimal discount
        -BigDecimal grandTotal
        +calculateTax() BigDecimal
        +calculateShipping() BigDecimal
    }
    
    Cart ||--o{ CartItem : contains
    CartController --> Cart : manages
    CheckoutController --> Cart : processes
    CheckoutController --> PriceDto : calculates
```

---

## 📋 Class Diagram - Order Management

```mermaid
classDiagram
    class Order {
        -Long id
        -String orderId
        -Long customerId
        -String customerEmail
        -Double totalAmount
        -Double subtotal
        -Double shipping
        -Double tax
        -Double discount
        -OrderStatus status
        -LocalDateTime orderDate
        -LocalDateTime estimatedDelivery
        -String shippingFullName
        -String shippingPhone
        -String shippingAddressLine1
        -String paymentType
        -String paymentDetails
        -List~OrderItem~ items
        +calculateTotal() Double
        +canBeCancelled() boolean
        +updateStatus(OrderStatus) void
    }
    
    class OrderItem {
        -Long id
        -Order order
        -Long productId
        -String productName
        -String productImage
        -Integer quantity
        -Double price
        -Double total
        +getLineTotal() Double
    }
    
    class OrderStatus {
        <<enumeration>>
        PENDING
        CONFIRMED
        PROCESSING
        SHIPPED
        DELIVERED
        CANCELLED
    }
    
    class OrderController {
        -OrderService orderService
        +createOrder(Map) ResponseEntity
        +getOrder(String) ResponseEntity
        +getOrdersByUser(Long) ResponseEntity
        +updateOrder(String, Order) ResponseEntity
        +cancelOrder(String) ResponseEntity
        +trackOrder(String) ResponseEntity
    }
    
    Order ||--o{ OrderItem : contains
    Order --> OrderStatus : has
    OrderController --> Order : manages
```

---

## 🔄 Sequence Diagram - Order Creation Flow

```mermaid
sequenceDiagram
    participant F as Frontend
    participant G as Gateway
    participant CS as Cart Service
    participant PS as Product Service
    participant OS as Order Service
    participant ES as Email Service
    participant DB as Database
    
    F->>G: POST /checkout
    G->>CS: checkout(userId, addressId, shipping, method)
    
    Note over CS: Get user cart
    CS->>DB: SELECT cart items
    DB-->>CS: Cart items
    
    Note over CS: Validate products
    CS->>PS: getProducts(productIds)
    PS-->>CS: Product details
    
    Note over CS: Calculate pricing
    CS->>CS: calculatePricing()
    
    Note over CS: Create order
    CS->>OS: createOrder(orderData)
    OS->>DB: INSERT order
    DB-->>OS: Order created
    OS-->>CS: Order response
    
    Note over CS: Reduce inventory
    loop For each product
        CS->>PS: reduceStock(productId, quantity)
        PS->>DB: UPDATE product stock
        DB-->>PS: Stock updated
        PS-->>CS: Success
    end
    
    Note over CS: Send confirmation email
    CS->>ES: sendOrderConfirmation(email, orderId)
    ES-->>CS: Email sent
    
    Note over CS: Clear cart
    CS->>DB: DELETE cart items
    DB-->>CS: Cart cleared
    
    CS-->>G: Order success response
    G-->>F: Order confirmation
```

---

## 🔐 Authentication Flow Diagram

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant G as Gateway
    participant US as User Service
    participant DB as Database
    participant SMS as SMS Service
    
    Note over U,SMS: Registration Flow
    U->>F: Enter registration details
    F->>G: POST /auth/register
    G->>US: Register user
    US->>DB: Check if user exists
    DB-->>US: User not found
    US->>DB: Create user
    DB-->>US: User created
    US->>SMS: Send OTP
    SMS-->>US: OTP sent
    US-->>G: Registration success
    G-->>F: User data
    F-->>U: OTP verification required
    
    Note over U,SMS: OTP Verification
    U->>F: Enter OTP
    F->>G: POST /auth/verify-otp
    G->>US: Verify OTP
    US->>US: Validate OTP
    US->>DB: Update user as verified
    DB-->>US: User updated
    US-->>G: Verification success
    G-->>F: User verified
    F-->>U: Registration complete
    
    Note over U,DB: Login Flow
    U->>F: Enter credentials
    F->>G: POST /auth/login
    G->>US: Authenticate user
    US->>DB: Find user by email/phone
    DB-->>US: User found
    US->>US: Validate password
    US-->>G: Authentication success
    G-->>F: User data
    F->>F: Store in localStorage
    F-->>U: Login success
```

---

## 🛍️ Shopping Cart State Diagram

```mermaid
stateDiagram-v2
    [*] --> Empty
    
    Empty --> HasItems : Add first item
    HasItems --> HasItems : Add/Update/Remove items
    HasItems --> Empty : Remove all items
    HasItems --> Checkout : Proceed to checkout
    
    Checkout --> AddressSelection : Start checkout
    AddressSelection --> PaymentSelection : Address selected
    PaymentSelection --> OrderReview : Payment method selected
    OrderReview --> Processing : Confirm order
    
    Processing --> OrderCreated : Order successful
    Processing --> HasItems : Order failed
    
    OrderCreated --> Empty : Cart cleared
    
    state HasItems {
        [*] --> ItemsPresent
        ItemsPresent --> ItemsPresent : Modify quantities
        ItemsPresent --> ItemsPresent : Add more items
    }
    
    state Checkout {
        [*] --> StepOne
        StepOne --> StepTwo : Next
        StepTwo --> StepThree : Next
        StepThree --> [*] : Complete
    }
```

---

## 📦 Product Lifecycle Diagram

```mermaid
stateDiagram-v2
    [*] --> Draft
    
    Draft --> Active : Publish product
    Active --> OutOfStock : Stock depleted
    OutOfStock --> Active : Stock replenished
    Active --> Inactive : Deactivate
    Inactive --> Active : Reactivate
    Active --> Discontinued : Discontinue
    Inactive --> Discontinued : Discontinue
    
    state Active {
        [*] --> InStock
        InStock --> LowStock : Stock < threshold
        LowStock --> InStock : Stock replenished
        LowStock --> OutOfStock : Stock depleted
    }
    
    Discontinued --> [*]
```

---

## 🔄 Order Status Flow Diagram

```mermaid
stateDiagram-v2
    [*] --> Pending
    
    Pending --> Confirmed : Payment confirmed
    Pending --> Cancelled : Payment failed/User cancelled
    
    Confirmed --> Processing : Start processing
    Confirmed --> Cancelled : User cancellation
    
    Processing --> Shipped : Items shipped
    Processing --> Cancelled : Processing failed
    
    Shipped --> Delivered : Package delivered
    Shipped --> Returned : Return initiated
    
    Delivered --> Returned : Return requested
    Delivered --> [*] : Order complete
    
    Cancelled --> [*]
    Returned --> [*]
```

---

## 🏗️ Component Diagram - Frontend Architecture

```mermaid
graph TB
    subgraph "Angular Frontend"
        subgraph "Pages"
            HP[Home Page]
            PP[Products Page]
            PD[Product Detail]
            CP[Cart Page]
            CHP[Checkout Page]
            PR[Profile Page]
            LP[Login Page]
            RP[Register Page]
        end
        
        subgraph "Services"
            AS[Auth Service]
            US[User Service]
            PS[Product Service]
            CS[Cart Service]
            OS[Order Service]
        end
        
        subgraph "Shared"
            AG[Auth Guard]
            PI[Pipes]
            UT[Utils]
            MD[Models]
        end
        
        subgraph "Core"
            AC[App Component]
            AR[App Routing]
            HC[HTTP Client]
        end
    end
    
    HP --> PS
    PP --> PS
    PP --> CS
    PD --> PS
    PD --> CS
    CP --> CS
    CHP --> CS
    CHP --> US
    CHP --> OS
    PR --> US
    PR --> OS
    LP --> AS
    RP --> AS
    
    AG --> AS
    
    AS --> HC
    US --> HC
    PS --> HC
    CS --> HC
    OS --> HC
    
    AC --> AR
    AR --> AG
```

---

This comprehensive UML documentation provides visual representations of the system architecture, workflows, and detailed service interactions for the e-commerce platform.