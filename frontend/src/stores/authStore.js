import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

/**
 * Authentication Store
 * Manages user authentication state using Zustand
 * Persists auth state to localStorage
 */

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      /**
       * Register new user
       */
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/register', userData);
          const { token, user } = response.data;
          
          // Store token in localStorage
          localStorage.setItem('token', token);
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null
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
       * Login user
       */
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/login', credentials);
          const { token, user } = response.data;
          
          // Store token in localStorage
          localStorage.setItem('token', token);
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null
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
       * Logout user
       */
      logout: () => {
        localStorage.removeItem('token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null
        });
      },

      /**
       * Fetch current user profile
       */
      fetchUser: async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        set({ isLoading: true });
        try {
          const response = await api.get('/auth/me');
          set({
            user: response.data,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false
          });
          localStorage.removeItem('token');
        }
      },

      /**
       * Clear error
       */
      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
