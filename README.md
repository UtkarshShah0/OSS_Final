# E-Commerce Microservices Platform

A full-stack e-commerce application built with **Angular 18** frontend and **Spring Boot** microservices architecture.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│   Angular 18    │    │   API Gateway    │    │   Microservices     │
│   Frontend      │◄──►│   (Port 9090)    │◄──►│   Ecosystem         │
│   (Port 4200)   │    │                  │    │                     │
└─────────────────┘    └──────────────────┘    └─────────────────────┘
                                │
                                ▼
        ┌───────────────────────────────────────────────────────┐
        │                 Microservices                         │
        ├─────────────┬─────────────┬─────────────┬─────────────┤
        │ User Service│ Product     │ Cart Service│ Order       │
        │ (Port 8089) │ Catalog     │ (Port 8085) │ Management  │
        │             │ (Port 8082) │             │ (Port 8084) │
        └─────────────┴─────────────┴─────────────┴─────────────┘
                                │
                                ▼
                    ┌─────────────────────┐
                    │   MySQL Database    │
                    │   (Port 3306)       │
                    └─────────────────────┘
```

## 🚀 Features

### Core E-Commerce Features
- **User Management**: Registration, Login, Profile Management
- **Product Catalog**: Browse products, categories, search, reviews
- **Shopping Cart**: Add/remove items, quantity management
- **Order Management**: Place orders, order history, tracking
- **Payment Processing**: Multiple payment methods (Card, UPI, COD, BNPL)
- **Address Management**: Multiple shipping addresses
- **Inventory Management**: Real-time stock tracking

### Technical Features
- **Microservices Architecture**: Scalable, maintainable service separation
- **API Gateway**: Centralized routing and load balancing
- **Service Communication**: Feign clients for inter-service communication
- **Database Per Service**: Independent data management
- **Responsive UI**: Mobile-first Angular application
- **Real-time Updates**: Dynamic cart and inventory updates

## 🛠️ Technology Stack

### Frontend
- **Angular 18** - Modern web framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **RxJS** - Reactive programming
- **Angular Router** - Client-side routing

### Backend
- **Spring Boot 3.x** - Java microservices framework
- **Spring Cloud Gateway** - API Gateway
- **Spring Data JPA** - Data persistence
- **OpenFeign** - Service-to-service communication
- **MySQL** - Relational database
- **Maven** - Dependency management

## 📋 Prerequisites

- **Java 17+**
- **Node.js 18+**
- **MySQL 8.0+**
- **Maven 3.6+**
- **Angular CLI 18+**

## 🚀 Quick Start

### 1. Database Setup
```sql
CREATE DATABASE Training;
-- Run seed.sql from product-catalog service
```

### 2. Backend Services
```bash
# Start services in order:
cd oss-backend/eureka-server && mvn spring-boot:run
cd oss-backend/api-gateway && mvn spring-boot:run
cd oss-backend/user-service && mvn spring-boot:run
cd oss-backend/product-catalog && mvn spring-boot:run
cd oss-backend/cart-service && mvn spring-boot:run
cd oss-backend/order-management-master && mvn spring-boot:run
```

### 3. Frontend
```bash
cd oss-frontend
npm install
npm start
```

### 4. Access Application
- **Frontend**: http://localhost:4200
- **API Gateway**: http://localhost:9090

## 📊 Service Ports

| Service | Port | Purpose |
|---------|------|---------|
| Frontend | 4200 | Angular Application |
| API Gateway | 9090 | Request Routing |
| User Service | 8089 | User Management |
| Product Catalog | 8082 | Product Management |
| Cart Service | 8085 | Shopping Cart |
| Order Management | 8084 | Order Processing |
| Eureka Server | 8761 | Service Discovery |

## 🔄 Application Workflow

### User Journey
1. **Registration/Login** → User Service
2. **Browse Products** → Product Catalog Service
3. **Add to Cart** → Cart Service
4. **Checkout Process** → Multiple Services
5. **Place Order** → Order Management Service
6. **Inventory Update** → Product Catalog Service

### Data Flow
```
Frontend → API Gateway → Microservice → Database
    ↑                                      ↓
    └──────── Response ←──────────────────┘
```

## 📁 Project Structure

```
├── oss-frontend/                 # Angular Frontend
│   ├── src/app/
│   │   ├── pages/               # Page Components
│   │   ├── services/            # API Services
│   │   └── shared/              # Shared Components
├── oss-backend/                 # Spring Boot Backend
│   ├── api-gateway/             # API Gateway Service
│   ├── user-service/            # User Management
│   ├── product-catalog/         # Product Management
│   ├── cart-service/            # Shopping Cart
│   ├── order-management-master/ # Order Processing
│   └── eureka-server/           # Service Discovery
└── docs/                        # Documentation
```

## 📚 Documentation

- [Frontend Architecture](docs/FRONTEND_ARCHITECTURE.md)
- [Microservices Architecture](docs/MICROSERVICES_ARCHITECTURE.md)
- [API Documentation](docs/API_DOCUMENTATION.md)
- [Database Schema](docs/DATABASE_SCHEMA.md)
- [UML Diagrams](docs/UML_DIAGRAMS.md)

## 🔐 Authentication

Currently uses **localStorage-based session management**:
- Simple token storage for development
- User data persisted in browser storage
- No JWT implementation (suitable for demo/development)

## 🧪 Testing

### Frontend Testing
```bash
cd oss-frontend
npm test
```

### Backend Testing
```bash
cd oss-backend/[service-name]
mvn test
```

## 🚀 Deployment

### Development
- All services run locally
- MySQL database on localhost
- Frontend served by Angular CLI

### Production Considerations
- Containerize services with Docker
- Use Kubernetes for orchestration
- Implement proper JWT authentication
- Add monitoring and logging
- Set up CI/CD pipelines

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Frontend**: Angular 18, TypeScript, Tailwind CSS
- **Backend**: Spring Boot, Microservices, MySQL
- **Architecture**: API Gateway, Service Discovery, Inter-service Communication

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check documentation in `/docs` folder
- Review API endpoints in service documentation

---

**Built with ❤️ using modern web technologies and microservices architecture**