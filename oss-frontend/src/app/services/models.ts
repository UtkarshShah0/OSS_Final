export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  category?: string;
  categories?: string[];
  brand: string;
  inStock: boolean;
  stockCount: number;
  specifications?: { [key: string]: string };
  reviews?: Review[];
  tags?: string[];
}

export interface Review {
  id: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  images?: string[];
  helpful?: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
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

export interface OrderItem {
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  total: number;
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
