# API Documentation - E-Commerce Microservices

## 🌐 API Gateway Overview

All API requests go through the **API Gateway** at `http://localhost:9090`

### Base URLs
- **API Gateway**: `http://localhost:9090`
- **User Service**: `http://localhost:8089` (via gateway: `/auth/**`, `/users/**`)
- **Product Catalog**: `http://localhost:8082` (via gateway: `/api/products/**`)
- **Cart Service**: `http://localhost:8085` (via gateway: `/cart/**`, `/checkout/**`)
- **Order Management**: `http://localhost:8084` (via gateway: `/api/orders/**`)

---

## 👤 User Service API

### Authentication Endpoints

#### POST `/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "phone": "+1234567890",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "phone": "+1234567890",
  "name": "John Doe",
  "addresses": [],
  "paymentMethods": [],
  "orders": [],
  "wishlist": []
}
```

#### POST `/auth/login`
Authenticate user credentials.

**Request Body:**
```json
{
  "identifier": "user@example.com",  // email or phone
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "phone": "+1234567890",
  "name": "John Doe",
  "addresses": [...],
  "paymentMethods": [...],
  "orders": [...],
  "wishlist": [...]
}
```

#### POST `/auth/verify-otp`
Verify OTP for phone number verification.

**Request Body:**
```json
{
  "phone": "+1234567890",
  "otp": "123456"
}
```

### User Management Endpoints

#### GET `/users/{userId}/addresses`
Get all addresses for a user.

**Response:**
```json
[
  {
    "id": 1,
    "fullName": "John Doe",
    "phone": "+1234567890",
    "line1": "123 Main St",
    "line2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "USA",
    "isDefault": true
  }
]
```

#### POST `/users/{userId}/addresses`
Add a new address for a user.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "phone": "+1234567890",
  "line1": "123 Main St",
  "line2": "Apt 4B",
  "city": "New York",
  "state": "NY",
  "postalCode": "10001",
  "country": "USA",
  "isDefault": false
}
```

#### GET `/users/{userId}/payments`
Get all payment methods for a user.

**Response:**
```json
[
  {
    "id": 1,
    "provider": "VISA",
    "token": "card_1234567890_4242",
    "isDefault": true,
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

#### POST `/users/{userId}/payments`
Add a new payment method.

**Request Body:**
```json
{
  "provider": "VISA",
  "token": "card_1234567890_4242"
}
```

#### GET `/users/{userId}/wishlist`
Get user's wishlist.

**Response:**
```json
[
  {
    "id": 1,
    "userId": 1,
    "productId": 5,
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

#### POST `/users/{userId}/wishlist`
Add product to wishlist.

**Request Body:**
```json
{
  "productId": 5
}
```

#### DELETE `/users/{userId}/wishlist/{productId}`
Remove product from wishlist.

---

## 🛍️ Product Catalog API

### Product Endpoints

#### GET `/api/products`
Get all products with full details.

**Response:**
```json
[
  {
    "id": 1,
    "sku": "SKU-APL-IP15PM",
    "name": "Apple iPhone 15 Pro Max",
    "brand": "Apple",
    "description": "A17 Pro chip, Titanium body, Pro camera system",
    "price": 134999.00,
    "currency": "INR",
    "stock": 44,
    "availabilityStatus": "IN_STOCK",
    "specifications": {
      "Storage": "256GB",
      "Color": "Natural Titanium"
    },
    "categories": ["Electronics"],
    "imageUrls": [
      "https://images.unsplash.com/photo-1720357632099-6d84cd7ee044..."
    ],
    "averageRating": 4.5,
    "reviewCount": 128,
    "reviews": [...]
  }
]
```

#### GET `/api/products/{id}`
Get a specific product by ID.

**Response:** Same as single product object above.

#### PUT `/api/products/{id}/reduce-stock`
Reduce product stock (used during order processing).

**Query Parameters:**
- `quantity` (required): Number of items to reduce

**Response:**
```json
"Stock reduced successfully"
```

#### GET `/api/products/{id}/check-stock`
Check if sufficient stock is available.

**Query Parameters:**
- `quantity` (required): Quantity to check

**Response:**
```json
true  // or false
```

### Image Endpoints

#### POST `/api/products/{id}/image`
Upload product image.

**Request:** Multipart file upload

**Response:**
```json
"Image uploaded successfully"
```

#### GET `/api/products/image/{imageId}`
Get product image by ID.

**Response:** Binary image data

### Review Endpoints

#### GET `/api/products/{productId}/reviews`
Get all reviews for a product.

**Response:**
```json
[
  {
    "id": 1,
    "userId": 1001,
    "userName": "John Doe",
    "userAvatar": null,
    "rating": 5,
    "title": "Amazing phone",
    "comment": "Love the new titanium design and camera quality.",
    "verifiedPurchase": true,
    "helpfulCount": 234,
    "createdAt": "2024-01-15T10:12:00Z"
  }
]
```

#### POST `/api/products/{productId}/reviews`
Create a new review.

**Request Body:**
```json
{
  "userId": 1,
  "userName": "John Doe",
  "rating": 5,
  "title": "Great product",
  "comment": "Highly recommended!",
  "verifiedPurchase": true
}
```

---

## 🛒 Cart Service API

### Cart Management

#### GET `/cart/{userId}`
Get user's cart with all items.

**Response:**
```json
{
  "id": 1,
  "userId": 1,
  "items": [
    {
      "id": 10,
      "productId": 2,
      "quantity": 1,
      "variant": null
    }
  ],
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

#### POST `/cart/{userId}/items`
Add item to cart.

**Query Parameters:**
- `productId` (required): Product ID to add
- `quantity` (required): Quantity to add
- `variant` (optional): Product variant

**Response:** Updated cart object

#### PUT `/cart/{userId}/items/{itemId}`
Update cart item quantity.

**Query Parameters:**
- `quantity` (required): New quantity

**Response:** Updated cart object

#### DELETE `/cart/{userId}/items/{itemId}`
Remove item from cart.

**Response:** Updated cart object

#### GET `/cart/{userId}/price`
Get cart pricing details.

**Response:**
```json
{
  "subtotal": 134999.00,
  "tax": 24299.82,
  "shipping": 0.00,
  "discount": 0.00,
  "grandTotal": 159298.82
}
```

### Checkout

#### POST `/checkout`
Process checkout and create order.

**Query Parameters:**
- `userId` (required): User ID
- `addressId` (required): Shipping address ID
- `shipping` (optional): Shipping method (default: "STANDARD")
- `method` (required): Payment method

**Response:**
```json
{
  "order": {
    "orderId": "ORD-1234567890",
    "status": "PENDING",
    "totalAmount": 159298.82
  },
  "payment": {
    "intentId": "pi_1234567890",
    "status": "confirmed"
  },
  "message": "Order placed successfully!"
}
```

---

## 📦 Order Management API

### Order Operations

#### POST `/api/orders/`
Create a new order (used by frontend).

**Request Body:**
```json
{
  "userId": 1,
  "customerId": 1,
  "items": [
    {
      "productId": 1,
      "productName": "Apple iPhone 15 Pro Max",
      "productImage": "https://...",
      "quantity": 1,
      "price": 134999.00,
      "total": 134999.00
    }
  ],
  "subtotal": 134999.00,
  "shipping": 0.00,
  "tax": 24299.82,
  "discount": 0.00,
  "total": 159298.82,
  "shippingAddress": {
    "fullName": "John Doe",
    "phone": "+1234567890",
    "addressLine1": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "paymentMethod": {
    "type": "card",
    "cardNumber": "**** **** **** 4242",
    "cardHolder": "John Doe"
  }
}
```

**Response:**
```json
{
  "id": "ORD-1234567890",
  "date": "2024-01-15T10:30:00Z",
  "status": "pending",
  "items": [...],
  "subtotal": 134999.00,
  "shipping": 0.00,
  "tax": 24299.82,
  "discount": 0.00,
  "total": 159298.82,
  "shippingAddress": {...},
  "paymentMethod": {...},
  "trackingNumber": "",
  "estimatedDelivery": "2024-01-22"
}
```

#### GET `/api/orders/{orderId}`
Get order details by order ID.

**Response:** Same as order object above.

#### GET `/api/orders/user/{userId}`
Get all orders for a user.

**Response:** Array of order objects.

#### PUT `/api/orders/{orderId}`
Update order details.

**Request Body:** Updated order object

#### DELETE `/api/orders/{orderId}`
Cancel an order.

**Response:**
```json
"Order cancelled successfully"
```

#### GET `/api/orders/{orderId}/track`
Track order status.

**Response:** Order object with current status.

### Legacy Endpoints

#### POST `/api/orders/create`
Create order from cart service (legacy).

**Request Body:**
```json
{
  "userId": 1,
  "addressId": 1,
  "shippingOption": "standard",
  "amount": 159298.82,
  "items": [
    {
      "productId": 1,
      "quantity": 1,
      "unitPrice": 134999.00,
      "lineTotal": 134999.00
    }
  ]
}
```

---

## 🔧 Common Response Patterns

### Success Response
```json
{
  "status": "success",
  "data": {...},
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error - Server error |

## 🔐 Authentication

### Current Implementation
- **Type**: localStorage-based session
- **Token**: Simple string stored in browser
- **Validation**: Client-side only (no server validation)

### Headers
```http
Content-Type: application/json
Accept: application/json
```

### Future JWT Implementation
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📊 Rate Limiting

### Current Limits
- No rate limiting implemented
- All endpoints accept unlimited requests

### Recommended Limits (Production)
- **Authentication**: 5 requests/minute per IP
- **Product Catalog**: 100 requests/minute per user
- **Cart Operations**: 50 requests/minute per user
- **Order Creation**: 10 requests/minute per user

## 🧪 Testing Endpoints

### Using cURL

#### Register User
```bash
curl -X POST http://localhost:9090/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "phone": "+1234567890",
    "password": "password123",
    "name": "Test User"
  }'
```

#### Get Products
```bash
curl -X GET http://localhost:9090/api/products \
  -H "Accept: application/json"
```

#### Add to Cart
```bash
curl -X POST "http://localhost:9090/cart/1/items?productId=1&quantity=2" \
  -H "Content-Type: application/json"
```

### Using Postman
1. Import the API collection (can be generated from this documentation)
2. Set base URL to `http://localhost:9090`
3. Configure environment variables for user IDs and tokens

---

This API documentation provides comprehensive coverage of all endpoints available in the e-commerce microservices platform. Each endpoint includes request/response examples and proper HTTP status codes for effective integration and testing.