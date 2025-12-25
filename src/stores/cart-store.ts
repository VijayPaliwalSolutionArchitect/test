import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, AppliedCoupon } from '@/types'

interface CartState {
  items: CartItem[]
  subtotal: number
  discount: number
  shipping: number
  tax: number
  total: number
  appliedCoupons: AppliedCoupon[]
  isLoading: boolean
  isOpen: boolean
  
  // Actions
  addItem: (item: Omit<CartItem, 'id' | 'subtotal'>) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  applyCoupon: (coupon: AppliedCoupon) => void
  removeCoupon: (code: string) => void
  setShipping: (amount: number) => void
  setLoading: (loading: boolean) => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  syncWithServer: (cart: CartState) => void
}

const TAX_RATE = 0.1 // 10%

function calculateTotals(items: CartItem[], discount: number, shipping: number) {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0)
  const taxableAmount = Math.max(0, subtotal - discount)
  const tax = taxableAmount * TAX_RATE
  const total = taxableAmount + tax + shipping
  
  return { subtotal, tax, total }
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      subtotal: 0,
      discount: 0,
      shipping: 0,
      tax: 0,
      total: 0,
      appliedCoupons: [],
      isLoading: false,
      isOpen: false,
      
      addItem: (item) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) => i.productId === item.productId && i.variantId === item.variantId
          )
          
          let newItems: CartItem[]
          
          if (existingIndex > -1) {
            // Update existing item
            newItems = state.items.map((i, index) => {
              if (index === existingIndex) {
                const newQuantity = i.quantity + item.quantity
                return {
                  ...i,
                  quantity: newQuantity,
                  subtotal: newQuantity * i.price,
                }
              }
              return i
            })
          } else {
            // Add new item
            const newItem: CartItem = {
              ...item,
              id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              subtotal: item.quantity * item.price,
            }
            newItems = [...state.items, newItem]
          }
          
          const { subtotal, tax, total } = calculateTotals(
            newItems,
            state.discount,
            state.shipping
          )
          
          return {
            items: newItems,
            subtotal,
            tax,
            total,
          }
        })
      },
      
      removeItem: (itemId) => {
        set((state) => {
          const newItems = state.items.filter((i) => i.id !== itemId)
          const { subtotal, tax, total } = calculateTotals(
            newItems,
            state.discount,
            state.shipping
          )
          
          return {
            items: newItems,
            subtotal,
            tax,
            total,
          }
        })
      },
      
      updateQuantity: (itemId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return get().removeItem(itemId) as unknown as Partial<CartState>
          }
          
          const newItems = state.items.map((i) => {
            if (i.id === itemId) {
              return {
                ...i,
                quantity,
                subtotal: quantity * i.price,
              }
            }
            return i
          })
          
          const { subtotal, tax, total } = calculateTotals(
            newItems,
            state.discount,
            state.shipping
          )
          
          return {
            items: newItems,
            subtotal,
            tax,
            total,
          }
        })
      },
      
      clearCart: () => {
        set({
          items: [],
          subtotal: 0,
          discount: 0,
          shipping: 0,
          tax: 0,
          total: 0,
          appliedCoupons: [],
        })
      },
      
      applyCoupon: (coupon) => {
        set((state) => {
          const exists = state.appliedCoupons.find((c) => c.code === coupon.code)
          if (exists) return state
          
          const newCoupons = [...state.appliedCoupons, coupon]
          const newDiscount = newCoupons.reduce((sum, c) => sum + c.discountAmount, 0)
          
          const { subtotal, tax, total } = calculateTotals(
            state.items,
            newDiscount,
            state.shipping
          )
          
          return {
            appliedCoupons: newCoupons,
            discount: newDiscount,
            subtotal,
            tax,
            total,
          }
        })
      },
      
      removeCoupon: (code) => {
        set((state) => {
          const newCoupons = state.appliedCoupons.filter((c) => c.code !== code)
          const newDiscount = newCoupons.reduce((sum, c) => sum + c.discountAmount, 0)
          
          const { subtotal, tax, total } = calculateTotals(
            state.items,
            newDiscount,
            state.shipping
          )
          
          return {
            appliedCoupons: newCoupons,
            discount: newDiscount,
            subtotal,
            tax,
            total,
          }
        })
      },
      
      setShipping: (amount) => {
        set((state) => {
          const { subtotal, tax, total } = calculateTotals(
            state.items,
            state.discount,
            amount
          )
          
          return {
            shipping: amount,
            subtotal,
            tax,
            total,
          }
        })
      },
      
      setLoading: (loading) => set({ isLoading: loading }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      
      syncWithServer: (cart) => {
        set({
          items: cart.items,
          subtotal: cart.subtotal,
          discount: cart.discount,
          shipping: cart.shipping,
          tax: cart.tax,
          total: cart.total,
          appliedCoupons: cart.appliedCoupons,
        })
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
        appliedCoupons: state.appliedCoupons,
        shipping: state.shipping,
      }),
    }
  )
)

// Selectors
export const selectCartItemCount = (state: CartState) =>
  state.items.reduce((sum, item) => sum + item.quantity, 0)

export const selectCartItem = (productId: string, variantId?: string) => (state: CartState) =>
  state.items.find((i) => i.productId === productId && i.variantId === variantId)
