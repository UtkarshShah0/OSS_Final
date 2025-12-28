# Database Schema - E-Commerce Platform

## 🗄️ Database Architecture Overview

The platform uses **MySQL 8.0** with a **database-per-service** pattern. Each microservice manages its own database schema, ensuring data isolation and service independence.

```
┌─────────────────────────────────────────────────────────────┐
│                    MySQL Database (Port 3306)              │
│                      Database: Training                     │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐ │
│  │    User     │ │   Product   │ │    Cart     │ │  Order  │ │
│  │   Schema    │ │   Schema    │ │   Schema    │ │ Schema  │ │
│  │             │ │             │ │             │ │         │ │
│  │ • users     │ │ • products  │ │ • cart      │ │ • orders│ │
│  │ • addresses │ │ • categories│ │ • cart_item │ │ • order │ │
│  │ • payments  │ │ • reviews   │ │             │ │   _item │ │
│  │ • wishlist  │ │ • images    │ │             │ │         │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 👤 User Service Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    avatar VARCHAR(500),
    mfa_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_phone (phone)
);
```

**Sample Data:**
```sql
INSERT INTO users (email, phone, password, name) VALUES
('john.doe@example.com', '+1234567890', '$2a$10$encrypted_password', 'John Doe'),
('jane.smith@example.com', '+1987654321', '$2a$10$encrypted_password', 'Jane Smith');
```

### Addresses Table
```sql
CREATE TABLE addresses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    line1 VARCHAR(500) NOT NULL,
    line2 VARCHAR(500),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'India',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_default (user_id, is_default)
);
```

**Sample Data:**
```sql
INSERT INTO addresses (user_id, full_name, phone, line1, city, state, postal_code, country, is_default) VALUES
(1, 'John Doe', '+1234567890', '123 Main St', 'New York', 'NY', '10001', 'USA', true),
(1, 'John Doe', '+1234567890', '456 Oak Ave', 'Boston', 'MA', '02101', 'USA', false);
```

### Payment Methods Table
```sql
CREATE TABLE payment_methods (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    provider VARCHAR(50) NOT NULL, -- VISA, MASTERCARD, UPI, etc.
    token VARCHAR(255) NOT NULL,   -- Tokenized payment data
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_default (user_id, is_default)
);
```

**Sample Data:**
```sql
INSERT INTO payment_methods (user_id, provider, token, is_default) VALUES
(1, 'VISA', 'card_1234567890_4242', true),
(1, 'UPI', 'upi_1234567890_john@paytm', false);
```

### Wishlist Table
```sql
CREATE TABLE wishlist (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product (user_id, product_id),
    INDEX idx_user_id (user_id),
    INDEX idx_product_id (product_id)
);
```

**Sample Data:**
```sql
INSERT INTO wishlist (user_id, product_id) VALUES
(1, 1), (1, 3), (2, 2);
```

---

## 🛍️ Product Catalog Schema

### Categories Table
```sql
CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_name (name)
);
```

**Sample Data:**
```sql
INSERT INTO categories (name, description) VALUES
('Electronics', 'Phones, computers, audio and home electronics'),
('Fashion', 'Clothing, shoes and accessories'),
('Home & Living', 'Home appliances and furniture'),
('Books', 'Printed and digital books'),
('Sports', 'Sporting goods and equipment'),
('Beauty', 'Beauty and personal care');
```

### Products Table
```sql
CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(500) NOT NULL,
    brand VARCHAR(255),
    description TEXT,
    price DECIMAL(13,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    stock INT NOT NULL DEFAULT 0,
    availability_status VARCHAR(50) DEFAULT 'IN_STOCK',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_sku (sku),
    INDEX idx_name (name),
    INDEX idx_brand (brand),
    INDEX idx_price (price),
    INDEX idx_stock (stock),
    INDEX idx_status (availability_status),
    INDEX idx_active (active)
);
```

**Sample Data:**
```sql
INSERT INTO products (sku, name, brand, description, price, currency, stock, availability_status, active) VALUES
('SKU-APL-IP15PM', 'Apple iPhone 15 Pro Max', 'Apple', 'A17 Pro chip, Titanium body, Pro camera system', 134999.00, 'INR', 45, 'IN_STOCK', 1),
('SKU-APL-MB16M3', 'MacBook Pro 16 M3 Max', 'Apple', 'M3 Max, Liquid Retina XDR 16-inch', 349999.00, 'INR', 12, 'IN_STOCK', 1),
('SKU-SON-WH1000XM5', 'Sony WH-1000XM5 Headphones', 'Sony', 'Noise cancelling, 30hr battery', 29999.00, 'INR', 78, 'IN_STOCK', 1),
('SKU-SAM-65QLED', 'Samsung 65 4K QLED', 'Samsung', 'Quantum Dot color, Smart Tizen', 129999.00, 'INR', 23, 'IN_STOCK', 1),
('SKU-NIK-AIR270', 'Nike Air Max 270', 'Nike', 'Air Max cushioning, everyday wear', 8999.00, 'INR', 156, 'IN_STOCK', 1);
```

### Product Categories (Many-to-Many)
```sql
CREATE TABLE product_categories (
    product_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    PRIMARY KEY (product_id, category_id),
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    INDEX idx_product (product_id),
    INDEX idx_category (category_id)
);
```

**Sample Data:**
```sql
INSERT INTO product_categories (product_id, category_id) VALUES
(1, 1), (2, 1), (3, 1), (4, 1), (5, 2);
```

### Product Specifications
```sql
CREATE TABLE product_specs (
    product_id BIGINT NOT NULL,
    spec_key VARCHAR(255) NOT NULL,
    spec_value VARCHAR(1000),
    PRIMARY KEY (product_id, spec_key),
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product (product_id),
    INDEX idx_key (spec_key)
);
```

**Sample Data:**
```sql
INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES
(1, 'Storage', '256GB'),
(1, 'Color', 'Natural Titanium'),
(2, 'Chip', 'M3 Max'),
(2, 'RAM', '36GB'),
(3, 'Battery', '30 hours');
```

### Product Images
```sql
CREATE TABLE product_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    image_data LONGBLOB,           -- Binary image data
    image_url VARCHAR(1000),       -- External image URL
    content_type VARCHAR(255),     -- MIME type
    alt_text VARCHAR(500),         -- Accessibility text
    sort_order INT DEFAULT 0,      -- Display order
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product (product_id),
    INDEX idx_sort (product_id, sort_order)
);
```

**Sample Data:**
```sql
INSERT INTO product_images (product_id, image_url, content_type, alt_text, sort_order) VALUES
(1, 'https://images.unsplash.com/photo-1720357632099-6d84cd7ee044', 'image/jpeg', 'iPhone 15 Pro Max', 1),
(2, 'https://images.unsplash.com/photo-1672241860863-fab879bd4a07', 'image/jpeg', 'MacBook Pro 16', 1),
(3, 'https://images.unsplash.com/photo-1549206464-82c129240d11', 'image/jpeg', 'Sony Headphones', 1);
```

### Reviews Table
```sql
CREATE TABLE reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_avatar VARCHAR(1000),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(500) NOT NULL,
    comment TEXT,
    verified_purchase BOOLEAN DEFAULT FALSE,
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product (product_id),
    INDEX idx_user (user_id),
    INDEX idx_rating (product_id, rating),
    INDEX idx_created (created_at)
);
```

**Sample Data:**
```sql
INSERT INTO reviews (product_id, user_id, user_name, rating, title, comment, verified_purchase, helpful_count, created_at) VALUES
(1, 1001, 'John Doe', 5, 'Amazing phone', 'Love the new titanium design and camera quality.', true, 234, '2024-01-15 10:12:00'),
(1, 1002, 'Jane Smith', 4, 'Great upgrade', 'Upgraded from iPhone 13. Performance improvement is noticeable.', true, 189, '2024-01-10 09:00:00'),
(3, 1100, 'AudioFan', 5, 'Fantastic ANC', 'Best noise cancelling headphones I have used.', true, 54, '2024-02-21 14:30:00');
```

---

## 🛒 Cart Service Schema

### Cart Table
```sql
CREATE TABLE cart (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_user (user_id)
);
```

**Sample Data:**
```sql
INSERT INTO cart (user_id) VALUES (1), (2);
```

### Cart Items Table
```sql
CREATE TABLE cart_item (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cart_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    variant VARCHAR(255),          -- Product variant (size, color, etc.)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (cart_id) REFERENCES cart(id) ON DELETE CASCADE,
    UNIQUE KEY unique_cart_product_variant (cart_id, product_id, variant),
    INDEX idx_cart (cart_id),
    INDEX idx_product (product_id)
);
```

**Sample Data:**
```sql
INSERT INTO cart_item (cart_id, product_id, quantity, variant) VALUES
(1, 1, 1, NULL),
(1, 3, 2, 'Black'),
(2, 2, 1, NULL);
```

---

## 📦 Order Management Schema

### Orders Table
```sql
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL UNIQUE,     -- Business order ID
    customer_id BIGINT NOT NULL,
    customer_email VARCHAR(255),
    
    -- Pricing
    total_amount DECIMAL(13,2) NOT NULL,
    subtotal DECIMAL(13,2),
    shipping DECIMAL(13,2) DEFAULT 0.00,
    tax DECIMAL(13,2) DEFAULT 0.00,
    discount DECIMAL(13,2) DEFAULT 0.00,
    
    -- Status and Dates
    status ENUM('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED') DEFAULT 'PENDING',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estimated_delivery TIMESTAMP,
    
    -- Shipping Address (denormalized for order history)
    shipping_full_name VARCHAR(255),
    shipping_phone VARCHAR(20),
    shipping_address_line1 VARCHAR(500),
    shipping_address_line2 VARCHAR(500),
    shipping_city VARCHAR(100),
    shipping_state VARCHAR(100),
    shipping_zip_code VARCHAR(20),
    shipping_country VARCHAR(100),
    
    -- Payment Information (denormalized)
    payment_type VARCHAR(50),         -- card, upi, cod, bnpl
    payment_details VARCHAR(255),     -- masked card, UPI ID, etc.
    payment_provider VARCHAR(100),    -- for BNPL providers
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_order_id (order_id),
    INDEX idx_customer (customer_id),
    INDEX idx_status (status),
    INDEX idx_date (order_date),
    INDEX idx_email (customer_email)
);
```

**Sample Data:**
```sql
INSERT INTO orders (order_id, customer_id, customer_email, total_amount, subtotal, shipping, tax, discount, status, 
                   shipping_full_name, shipping_phone, shipping_address_line1, shipping_city, shipping_state, 
                   shipping_zip_code, shipping_country, payment_type, payment_details) VALUES
('ORD-1234567890', 1, 'john.doe@example.com', 159298.82, 134999.00, 0.00, 24299.82, 0.00, 'PENDING',
 'John Doe', '+1234567890', '123 Main St', 'New York', 'NY', '10001', 'USA', 'card', '**** **** **** 4242'),
('ORD-1234567891', 2, 'jane.smith@example.com', 35998.82, 29999.00, 500.00, 5499.82, 0.00, 'CONFIRMED',
 'Jane Smith', '+1987654321', '456 Oak Ave', 'Boston', 'MA', '02101', 'USA', 'upi', 'jane@paytm');
```

### Order Items Table
```sql
CREATE TABLE order_item (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    product_name VARCHAR(500) NOT NULL,    -- Snapshot at order time
    product_image VARCHAR(1000),           -- Product image URL
    quantity INT NOT NULL,
    price DECIMAL(13,2) NOT NULL,          -- Unit price at order time
    total DECIMAL(13,2) NOT NULL,          -- Line total
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_order (order_id),
    INDEX idx_product (product_id)
);
```

**Sample Data:**
```sql
INSERT INTO order_item (order_id, product_id, product_name, product_image, quantity, price, total) VALUES
(1, 1, 'Apple iPhone 15 Pro Max', 'https://images.unsplash.com/photo-1720357632099-6d84cd7ee044', 1, 134999.00, 134999.00),
(2, 3, 'Sony WH-1000XM5 Headphones', 'https://images.unsplash.com/photo-1549206464-82c129240d11', 1, 29999.00, 29999.00);
```

---

## 🔗 Entity Relationship Diagrams

### User Service ER Diagram
```
┌─────────────┐     ┌─────────────────┐
│    users    │────▶│   addresses     │
│             │ 1:N │                 │
│ • id (PK)   │     │ • id (PK)       │
│ • email     │     │ • user_id (FK)  │
│ • phone     │     │ • full_name     │
│ • password  │     │ • phone         │
│ • name      │     │ • line1         │
└─────────────┘     │ • line2         │
        │           │ • city          │
        │           │ • state         │
        │           │ • postal_code   │
        │           │ • country       │
        │           │ • is_default    │
        │           └─────────────────┘
        │
        │           ┌─────────────────┐
        └──────────▶│ payment_methods │
        │       1:N │                 │
        │           │ • id (PK)       │
        │           │ • user_id (FK)  │
        │           │ • provider      │
        │           │ • token         │
        │           │ • is_default    │
        │           └─────────────────┘
        │
        │           ┌─────────────────┐
        └──────────▶│   wishlist      │
                1:N │                 │
                    │ • id (PK)       │
                    │ • user_id (FK)  │
                    │ • product_id    │
                    │ • created_at    │
                    └─────────────────┘
```

### Product Catalog ER Diagram
```
┌─────────────┐     ┌─────────────────┐     ┌─────────────┐
│ categories  │────▶│product_categories│◀────│  products   │
│             │ 1:N │                 │ N:1 │             │
│ • id (PK)   │     │ • product_id(FK)│     │ • id (PK)   │
│ • name      │     │ • category_id(FK)│     │ • sku       │
│ • description│     └─────────────────┘     │ • name      │
└─────────────┘                             │ • brand     │
                                            │ • price     │
                                            │ • stock     │
                                            └─────────────┘
                                                   │
                    ┌─────────────────┐           │ 1:N
                    │ product_specs   │◀──────────┤
                    │                 │           │
                    │ • product_id(FK)│           │
                    │ • spec_key      │           │
                    │ • spec_value    │           │
                    └─────────────────┘           │
                                                  │
                    ┌─────────────────┐           │ 1:N
                    │ product_images  │◀──────────┤
                    │                 │           │
                    │ • id (PK)       │           │
                    │ • product_id(FK)│           │
                    │ • image_data    │           │
                    │ • image_url     │           │
                    │ • sort_order    │           │
                    └─────────────────┘           │
                                                  │
                    ┌─────────────────┐           │ 1:N
                    │    reviews      │◀──────────┘
                    │                 │
                    │ • id (PK)       │
                    │ • product_id(FK)│
                    │ • user_id       │
                    │ • rating        │
                    │ • title         │
                    │ • comment       │
                    └─────────────────┘
```

### Cart Service ER Diagram
```
┌─────────────┐     ┌─────────────────┐
│    cart     │────▶│   cart_item     │
│             │ 1:N │                 │
│ • id (PK)   │     │ • id (PK)       │
│ • user_id   │     │ • cart_id (FK)  │
│ • created_at│     │ • product_id    │
│ • updated_at│     │ • quantity      │
└─────────────┘     │ • variant       │
                    │ • created_at    │
                    │ • updated_at    │
                    └─────────────────┘
```

### Order Management ER Diagram
```
┌─────────────────┐     ┌─────────────────┐
│     orders      │────▶│   order_item    │
│                 │ 1:N │                 │
│ • id (PK)       │     │ • id (PK)       │
│ • order_id      │     │ • order_id (FK) │
│ • customer_id   │     │ • product_id    │
│ • customer_email│     │ • product_name  │
│ • total_amount  │     │ • product_image │
│ • subtotal      │     │ • quantity      │
│ • shipping      │     │ • price         │
│ • tax           │     │ • total         │
│ • discount      │     └─────────────────┘
│ • status        │
│ • order_date    │
│ • shipping_*    │ (denormalized address)
│ • payment_*     │ (denormalized payment)
└─────────────────┘
```

---

## 🔗 Cross-Service Relationships

### Logical Relationships (No Foreign Keys)
Since each service has its own database, relationships are maintained logically:

```
users.id ←→ cart.user_id
users.id ←→ orders.customer_id
users.id ←→ wishlist.user_id
users.id ←→ reviews.user_id

products.id ←→ cart_item.product_id
products.id ←→ order_item.product_id
products.id ←→ wishlist.product_id
products.id ←→ reviews.product_id
```

---

## 📊 Database Indexes and Performance

### Critical Indexes

#### User Service
```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_addresses_user_default ON addresses(user_id, is_default);
CREATE INDEX idx_wishlist_user_product ON wishlist(user_id, product_id);
```

#### Product Catalog
```sql
CREATE INDEX idx_products_name_brand ON products(name, brand);
CREATE INDEX idx_products_price_stock ON products(price, stock);
CREATE INDEX idx_reviews_product_rating ON reviews(product_id, rating);
```

#### Cart Service
```sql
CREATE INDEX idx_cart_user ON cart(user_id);
CREATE INDEX idx_cart_item_cart_product ON cart_item(cart_id, product_id);
```

#### Order Management
```sql
CREATE INDEX idx_orders_customer_date ON orders(customer_id, order_date);
CREATE INDEX idx_orders_status_date ON orders(status, order_date);
CREATE INDEX idx_order_items_order ON order_item(order_id);
```

---

## 🚀 Database Setup Commands

### Create Database
```sql
CREATE DATABASE Training CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE Training;
```

### Run Seed Data
```bash
# Execute the seed.sql file from product-catalog service
mysql -u root -p Training < oss-backend/product-catalog/seed.sql
```

### Clear Data (for testing)
```sql
-- Clear all data
DELETE FROM order_item;
DELETE FROM orders;
DELETE FROM cart_item;
DELETE FROM cart;
DELETE FROM wishlist;
DELETE FROM reviews;
DELETE FROM product_images;
DELETE FROM product_specs;
DELETE FROM product_categories;
DELETE FROM products;
DELETE FROM categories;
DELETE FROM payment_methods;
DELETE FROM addresses;
DELETE FROM users;

-- Reset auto-increment
ALTER TABLE users AUTO_INCREMENT = 1;
ALTER TABLE products AUTO_INCREMENT = 1;
ALTER TABLE orders AUTO_INCREMENT = 1;
```

---

This comprehensive database schema provides the foundation for the e-commerce platform with proper normalization, relationships, and performance optimization.