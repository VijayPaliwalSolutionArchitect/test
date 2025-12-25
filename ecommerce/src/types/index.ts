// Product Types
export interface ProductImage {
  url: string
  alt: string
  displayOrder: number
  isMain: boolean
}

export interface ProductVideo {
  url: string
  thumbnail: string
  duration?: number
  provider?: string
}

export interface ProductVariant {
  id: string
  sku: string
  name: string
  attributes: Record<string, string>
  price: number
  comparePrice?: number
  stockQuantity: number
  image?: string
  isAvailable: boolean
}

export interface ProductSpecification {
  group: string
  specs: Array<{ label: string; value: string }>
}

export interface Product {
  id: string
  name: string
  slug: string
  sku: string
  brand: string
  categoryId: string
  category?: Category
  price: number
  comparePrice?: number
  currency: string
  stockQuantity: number
  images: ProductImage[]
  videos?: ProductVideo[]
  shortDescription?: string
  fullDescription?: string
  specifications?: ProductSpecification[]
  attributes?: Record<string, unknown>
  variants?: ProductVariant[]
  hasVariants: boolean
  tags: string[]
  ratingAverage: number
  ratingCount: number
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED' | 'OUT_OF_STOCK'
  isFeatured: boolean
  isVisible: boolean
  freeShipping: boolean
  createdAt: string
  updatedAt: string
}

// Category Types
export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  parentId?: string
  path: string
  level: number
  image?: string
  icon?: string
  color?: string
  displayOrder: number
  isFeatured: boolean
  isVisible: boolean
  productCount: number
  children?: Category[]
}

// Cart Types
export interface CartItem {
  id: string
  productId: string
  variantId?: string
  name: string
  sku: string
  image?: string
  price: number
  quantity: number
  subtotal: number
  product?: Product
}

export interface Cart {
  id: string
  userId?: string
  sessionId?: string
  items: CartItem[]
  subtotal: number
  discount: number
  shipping: number
  tax: number
  total: number
  appliedCoupons?: AppliedCoupon[]
}

export interface AppliedCoupon {
  code: string
  discountAmount: number
  promotionId: string
}

// Order Types
export interface OrderItem {
  id: string
  productId: string
  variantId?: string
  name: string
  sku: string
  image?: string
  price: number
  quantity: number
  subtotal: number
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
}

export interface OrderAddress {
  firstName: string
  lastName: string
  company?: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
}

export interface Order {
  id: string
  orderNumber: string
  userId: string
  email: string
  phone?: string
  items: OrderItem[]
  subtotal: number
  discount: number
  shipping: number
  tax: number
  total: number
  currency: string
  shippingAddress: OrderAddress
  billingAddress?: OrderAddress
  shippingMethod?: string
  trackingNumber?: string
  paymentMethod: 'CARD' | 'COD' | 'UPI' | 'PAYPAL'
  paymentStatus: 'PENDING' | 'AUTHORIZED' | 'CAPTURED' | 'FAILED' | 'REFUNDED'
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED'
  customerNote?: string
  createdAt: string
  updatedAt: string
}

// User Types
export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  displayName?: string
  avatar?: string
  phone?: string
  role: 'CUSTOMER' | 'VENDOR' | 'ADMIN' | 'SUPER_ADMIN'
  loyaltyPoints: number
  loyaltyTier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM'
  referralCode: string
  createdAt: string
}

export interface Address {
  id: string
  userId: string
  type: 'SHIPPING' | 'BILLING' | 'BOTH'
  isDefault: boolean
  label?: string
  firstName: string
  lastName: string
  company?: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
}

// Review Types
export interface Review {
  id: string
  productId: string
  userId: string
  user?: {
    displayName?: string
    avatar?: string
  }
  rating: number
  title?: string
  content: string
  images?: string[]
  isVerifiedPurchase: boolean
  helpfulCount: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
}

// Promotion Types
export interface Promotion {
  id: string
  name: string
  code?: string
  type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING' | 'BOGO'
  discountType: string
  discountValue: number
  maxDiscount?: number
  minPurchaseAmount?: number
  startDate: string
  endDate: string
  isActive: boolean
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Filter Types
export interface ProductFilters {
  categoryId?: string
  brand?: string[]
  minPrice?: number
  maxPrice?: number
  rating?: number
  inStock?: boolean
  tags?: string[]
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'popular' | 'rating'
}

export interface SearchParams {
  query?: string
  page?: number
  pageSize?: number
  filters?: ProductFilters
}
