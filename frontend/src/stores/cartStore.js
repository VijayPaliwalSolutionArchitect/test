import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

/**
 * Cart Store
 * Manages shopping cart state using Zustand
 * Persists cart to localStorage and syncs with backend when user is authenticated
 */

export const useCartStore = create(
  persist(
    (set, get) => ({
      // State
      items: [],
      totalAmount: 0,
      isLoading: false,
      error: null,

      /**
       * Fetch cart from backend
       */
      fetchCart: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get('/cart');
          const cart = response.data;
          
          set({
            items: cart.items || [],
            totalAmount: cart.totalAmount || 0,
            isLoading: false
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.message 
          });
        }
      },

      /**
       * Add item to cart
       */
      addToCart: async (productId, quantity = 1) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/cart', { productId, quantity });
          const cart = response.data;
          
          set({
            items: cart.items || [],
            totalAmount: cart.totalAmount || 0,
            isLoading: false
          });
          
          return { success: true };
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.message 
          });
          return { success: false, error: error.message };
        }
      },

      /**
       * Update item quantity
       */
      updateQuantity: async (itemId, quantity) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.put(`/cart/${itemId}`, { quantity });
          const cart = response.data;
          
          set({
            items: cart.items || [],
            totalAmount: cart.totalAmount || 0,
            isLoading: false
          });
          
          return { success: true };
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.message 
          });
          return { success: false, error: error.message };
        }
      },

      /**
       * Remove item from cart
       */
      removeItem: async (itemId) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.delete(`/cart/${itemId}`);
          const cart = response.data;
          
          set({
            items: cart.items || [],
            totalAmount: cart.totalAmount || 0,
            isLoading: false
          });
          
          return { success: true };
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.message 
          });
          return { success: false, error: error.message };
        }
      },

      /**
       * Clear entire cart
       */
      clearCart: async () => {
        set({ isLoading: true, error: null });
        try {
          await api.delete('/cart');
          set({
            items: [],
            totalAmount: 0,
            isLoading: false
          });
          
          return { success: true };
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.message 
          });
          return { success: false, error: error.message };
        }
      },

      /**
       * Get cart item count
       */
      getItemCount: () => {
        const items = get().items;
        return items.reduce((total, item) => total + item.quantity, 0);
      },

      /**
       * Clear error
       */
      clearError: () => set({ error: null })
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ 
        items: state.items,
        totalAmount: state.totalAmount
      })
    }
  )
);
