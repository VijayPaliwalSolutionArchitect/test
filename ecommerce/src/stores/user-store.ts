import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'

interface UserState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // Actions
  setUser: (user: User | null) => void
  updateUser: (updates: Partial<User>) => void
  logout: () => void
  setLoading: (loading: boolean) => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      
      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        })
      },
      
      updateUser: (updates) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }))
      },
      
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        })
      },
      
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
