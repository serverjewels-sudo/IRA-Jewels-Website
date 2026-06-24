/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  category: 'Rings' | 'Earrings' | 'Pendants' | 'Necklaces' | 'Bangles' | 'Bracelets' | 'Nosepins';
  categorySlug: string;
  price: number;
  image: string;
  images: string[];
  description: string;
  materials: string[];
  details: string[];
  care: string;
  rating: number;
  reviewsCount: number;
  options: {
    metals: string[];
    sizes?: string[];
  };
  inStock: boolean;
  featured: boolean;
  bestseller: boolean;
  sku: string;
  stockQuantity?: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface CartItem {
  id: string; // unique cart entry identifier: `${productId}-${metal}-${size || ''}`
  product: Product;
  selectedMetal: string;
  selectedSize?: string;
  engraving?: string;
  quantity: number;
}

export interface PromoCode {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
}

export interface OrderDetails {
  items: CartItem[];
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
  };
  paymentInfo: {
    cardholderName: string;
    cardNumberMasked: string;
  };
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  orderNumber: string;
  date: string;
  utrNumber?: string;
}
