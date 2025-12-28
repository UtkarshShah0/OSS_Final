# Microservices Architecture - E-Commerce Platform

## 🏗️ Architecture Overview

The backend follows a **microservices architecture** pattern with independent, loosely-coupled services that communicate through well-defined APIs.

```
                    ┌─────────────────────┐
                    │   Angular Frontend  │
                    │    (Port 4200)      │
                    └──────────┬──────────┘
                               │ HTTP Requests
                               ▼
                    ┌─────────────────────┐
                    │   API Gateway       │
                    │    (Port 9090)      │
                    │  Spring Cloud GW    │
                    └──────────┬──────────┘
                               │ Route & Load Balance
                               ▼
        ┌──────────────────────────────────────────────────────┐
        │                Microservices Ecosystem               │
        └──────────────────────────────────────────────────────┘
                               │
    ┌──────────┬────────────┬──┴──────────┬─────────────┬──────────┐
    ▼          ▼            ▼             ▼             ▼          ▼
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────┐ ┌─────────┐ ┌─────────┐
│  User   │ │Product  │ │  Cart   │ │   Order     │ │ Payment │ │ Eureka  │
│Service  │ │Catalog  │ │Service  │ │ Management  │ │ Service │ │ Server  │
│:8089    │ │:8082    │ │:8085    │ │   :8084     │ │ :8765   │ │ :8761   │
└────┬────┘ └────┬────┘ └────┬────┘ └──────┬──────┘ └────┬────┘ └─────────┘
     │           │           │             │             │
     ▼           ▼           ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────┐
│                    MySQL Database                          │
│                     (Port 3306)                            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────────┐   │
│  │  Users  │ │Products │ │  Cart   │ │     Orders      │   │
│  │Database │ │Database │ │Database │ │   Database      │   │
│  └─────────┘ └─────────┘ └─────────┘ └─────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Microservices Design Principles

### 1. Single Responsibility
Each service owns a specific business domain:
- **User Service**: User management, authentication, profiles
- **Product Catalog**: Product information, categories, reviews
- **Cart Service**: Shopping cart operations, checkout
- **Order Management**: Order processing, tracking, history

### 2. Database Per Service
Each microservice has its own database schema:
- **Isolation**: No direct database access between services
- **Independence**: Services can evolve their data models independently
- **Scalability**: Each database can be optimized for its specific use case

### 3. API-First Communication
Services communicate only through well-defined REST APIs:
- **Loose Coupling**: Services don't share code or databases
- **Technology Agnostic**: Services can use different tech stacks
- **Versioning**: APIs can be versioned independently

## 🚪 API Gateway Pattern

### Spring Cloud Gateway (Port 9090)
```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: http://localhost:8089
          predicates:
            - Path=/auth/**, /users/**
        - id: product-catalog
          uri: http://localhost:8082
          predicates:
            - Path=/api/products/**
        - id: cart-service
          uri: http://localhost:8085
          predicates:
            - Path=/cart/**, /checkout/**
        - id: order-service
          uri: http://localhost:8084
          predicates:
            - Path=/api/orders/**
```

### Gateway Responsibilities
- **Request Routing**: Direct requests to appropriate services
- **Load Balancing**: Distribute load across service instances
- **Cross-Cutting Concerns**: CORS, rate limiting, authentication
- **API Composition**: Aggregate responses from multiple services

## 🔍 Service Discovery

### Eureka Server (Port 8761)
```java
@SpringBootApplication
@EnableEurekaServer
public class EurekaServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(EurekaServerApplication.class, args);
    }
}
```

### Service Registration
Each microservice registers with Eureka:
```yaml
eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
  instance:
    prefer-ip-address: true
```

## 🔗 Inter-Service Communication

### Feign Clients
Services communicate using declarative REST clients:

```java
@FeignClient(name = "product-service")
public interface ProductClient {
    @GetMapping("/products/{id}")
    ProductDto getProduct(@PathVariable Long id);
    
    @PostMapping("/products/batch")
    List<ProductDto> getProducts(@RequestBody List<Long> ids);
    
    @PutMapping("/products/{id}/reduce-stock")
    ResponseEntity<String> reduceStock(@PathVariable Long id, @RequestParam Integer quantity);
}
```

### Communication Patterns
1. **Synchronous**: HTTP REST calls via Feign clients
2. **Request-Response**: Direct service-to-service calls
3. **Circuit Breaker**: Fault tolerance (can be added with Hystrix)

## 📊 Service Details

### 1. User Service (Port 8089)

#### Responsibilities
- User registration and authentication
- Profile management
- Address and payment method storage
- Wishlist management

#### Key Components
```java
@RestController
@RequestMapping("/auth")
public class AuthController {
    @PostMapping("/register")
    @PostMapping("/login")
    @PostMapping("/verify-otp")
}

@RestController
@RequestMapping("/users")
public class UserController {
    @GetMapping("/{userId}/addresses")
    @PostMapping("/{userId}/addresses")
    @GetMapping("/{userId}/payments")
    @PostMapping("/{userId}/payments")
    @GetMapping("/{userId}/wishlist")
}
```

#### Database Schema
```sql
-- Users table
users (id, email, phone, password, name, created_at)

-- Addresses table  
addresses (id, user_id, full_name, phone, line1, line2, city, state, postal_code, country, is_default)

-- Payment Methods table
payment_methods (id, user_id, provider, token, is_default, created_at)

-- Wishlist table
wishlist (id, user_id, product_id, created_at)
```

### 2. Product Catalog Service (Port 8082)

#### Responsibilities
- Product information management
- Category management
- Product search and filtering
- Reviews and ratings
- Inventory management

#### Key Components
```java
@RestController
@RequestMapping("/api/products")
public class ProductController {
    @GetMapping
    @GetMapping("/{id}")
    @PostMapping
    @PutMapping("/{id}/reduce-stock")
    @GetMapping("/{id}/check-stock")
    @PostMapping("/{id}/image")
    @GetMapping("/image/{imageId}")
}
```

#### Database Schema
```sql
-- Products table
products (id, sku, name, brand, description, price, currency, stock, availability_status, active)

-- Categories table
categories (id, name, description)

-- Product Categories (Many-to-Many)
product_categories (product_id, category_id)

-- Product Specifications
product_specs (product_id, spec_key, spec_value)

-- Product Images
product_images (id, product_id, image_data, image_url, content_type, alt_text, sort_order)

-- Reviews
reviews (id, product_id, user_id, user_name, rating, title, comment, verified_purchase, created_at)
```

### 3. Cart Service (Port 8085)

#### Responsibilities
- Shopping cart management
- Cart item operations
- Checkout processing
- Price calculations

#### Key Components
```java
@RestController
@RequestMapping("/cart")
public class CartController {
    @GetMapping("/{userId}")
    @PostMapping("/{userId}/items")
    @PutMapping("/{userId}/items/{itemId}")
    @DeleteMapping("/{userId}/items/{itemId}")
    @GetMapping("/{userId}/price")
}

@RestController
@RequestMapping("/checkout")
public class CheckoutController {
    @PostMapping
    public ResponseEntity<Map<String,Object>> checkout(
        @RequestParam Long userId,
        @RequestParam Long addressId,
        @RequestParam String shipping,
        @RequestParam String method
    )
}
```

#### Database Schema
```sql
-- Cart table
cart (id, user_id, updated_at)

-- Cart Items table
cart_item (id, cart_id, product_id, quantity, variant)
```

### 4. Order Management Service (Port 8084)

#### Responsibilities
- Order creation and processing
- Order status management
- Order history
- Email notifications

#### Key Components
```java
@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @PostMapping("/")
    @GetMapping("/{orderId}")
    @GetMapping("/user/{userId}")
    @PutMapping("/{orderId}")
    @DeleteMapping("/{orderId}")
    @GetMapping("/{orderId}/track")
}
```

#### Database Schema
```sql
-- Orders table
orders (id, order_id, customer_id, customer_email, total_amount, subtotal, shipping, tax, discount, 
        status, order_date, estimated_delivery, shipping_full_name, shipping_phone, 
        shipping_address_line1, shipping_address_line2, shipping_city, shipping_state, 
        shipping_zip_code, shipping_country, payment_type, payment_details, payment_provider)

-- Order Items table
order_item (id, order_id, product_id, product_name, product_image, quantity, price, total)
```

## 🔄 Data Flow Patterns

### 1. User Registration Flow
```
Frontend → API Gateway → User Service → Database
                                    ↓
                              OTP Service → Email/SMS
```

### 2. Product Browsing Flow
```
Frontend → API Gateway → Product Catalog → Database
                                        ↓
                                  Return Products + Images
```

### 3. Add to Cart Flow
```
Frontend → API Gateway → Cart Service → Database
                              ↓
                        Validate with Product Service
```

### 4. Checkout Flow
```
Frontend → API Gateway → Cart Service → Order Service → Database
                              ↓              ↓
                        Product Service   Email Service
                        (Reduce Stock)   (Confirmation)
```

## 🛡️ Security Architecture

### Current Implementation
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(authz -> authz.anyRequest().permitAll());
        return http.build();
    }
}
```

### Production Security Recommendations
1. **JWT Authentication**: Implement token-based authentication
2. **OAuth2/OpenID Connect**: For social login integration
3. **API Rate Limiting**: Prevent abuse and DDoS attacks
4. **Input Validation**: Sanitize all user inputs
5. **HTTPS**: Encrypt all communications
6. **Service-to-Service Auth**: Mutual TLS or service tokens

## 📈 Scalability Patterns

### Horizontal Scaling
```yaml
# Docker Compose scaling
docker-compose up --scale user-service=3 --scale product-catalog=2
```

### Load Balancing
- **API Gateway**: Routes requests to available instances
- **Database**: Read replicas for read-heavy operations
- **Caching**: Redis for session and frequently accessed data

### Performance Optimization
1. **Database Indexing**: Optimize query performance
2. **Connection Pooling**: Efficient database connections
3. **Caching Strategy**: Application-level and database-level caching
4. **Async Processing**: Non-blocking operations where possible

## 🔧 Configuration Management

### Application Properties
```yaml
# Service-specific configuration
server:
  port: 8089

spring:
  application:
    name: user-service
  datasource:
    url: jdbc:mysql://localhost:3306/Training
    username: ${DB_USERNAME:root}
    password: ${DB_PASSWORD:password}
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false

eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
```

### Environment-Specific Configs
- **Development**: Local database, debug logging
- **Testing**: In-memory database, mock services
- **Production**: Cloud database, optimized settings

## 🚀 Deployment Architecture

### Local Development
```bash
# Start services in dependency order
1. MySQL Database
2. Eureka Server
3. API Gateway  
4. User Service
5. Product Catalog
6. Cart Service
7. Order Management
8. Frontend Application
```

### Production Deployment
```yaml
# Kubernetes deployment example
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
    spec:
      containers:
      - name: user-service
        image: user-service:latest
        ports:
        - containerPort: 8089
        env:
        - name: DB_HOST
          value: "mysql-service"
```

## 📊 Monitoring and Observability

### Health Checks
```java
@RestController
public class HealthController {
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP"));
    }
}
```

### Metrics and Logging
- **Spring Boot Actuator**: Health endpoints and metrics
- **Centralized Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Distributed Tracing**: Zipkin or Jaeger for request tracing
- **Monitoring**: Prometheus + Grafana for metrics visualization

## 🔄 Data Consistency Patterns

### Eventual Consistency
- **Cart to Order**: Cart data eventually consistent with order creation
- **Inventory Updates**: Stock levels updated asynchronously
- **User Profile**: Profile changes propagated to dependent services

### Saga Pattern (Future Enhancement)
For complex transactions spanning multiple services:
1. **Order Creation Saga**: User → Cart → Inventory → Payment → Order
2. **Compensation**: Rollback operations if any step fails
3. **Orchestration**: Central coordinator manages the saga

---

This microservices architecture provides a scalable, maintainable, and resilient foundation for the e-commerce platform, following industry best practices and patterns.