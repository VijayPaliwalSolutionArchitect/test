import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system'

interface UIState {
  theme: Theme
  sidebarOpen: boolean
  mobileMenuOpen: boolean
  searchOpen: boolean
  compareItems: string[]
  recentlyViewed: string[]
  
  // Actions
  setTheme: (theme: Theme) => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  toggleMobileMenu: () => void
  setMobileMenuOpen: (open: boolean) => void
  toggleSearch: () => void
  setSearchOpen: (open: boolean) => void
  addToCompare: (productId: string) => void
  removeFromCompare: (productId: string) => void
  clearCompare: () => void
  addToRecentlyViewed: (productId: string) => void
  clearRecentlyViewed: () => void
}

const MAX_COMPARE_ITEMS = 4
const MAX_RECENTLY_VIEWED = 20

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'system',
      sidebarOpen: true,
      mobileMenuOpen: false,
      searchOpen: false,
      compareItems: [],
      recentlyViewed: [],
      
      setTheme: (theme) => set({ theme }),
      
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
      
      toggleSearch: () => set((state) => ({ searchOpen: !state.searchOpen })),
      setSearchOpen: (open) => set({ searchOpen: open }),
      
      addToCompare: (productId) => {
        set((state) => {
          if (state.compareItems.includes(productId)) return state
          if (state.compareItems.length >= MAX_COMPARE_ITEMS) {
            // Remove oldest and add new
            return {
              compareItems: [...state.compareItems.slice(1), productId],
            }
          }
          return {
            compareItems: [...state.compareItems, productId],
          }
        })
      },
      
      removeFromCompare: (productId) => {
        set((state) => ({
          compareItems: state.compareItems.filter((id) => id !== productId),
        }))
      },
      
      clearCompare: () => set({ compareItems: [] }),
      
      addToRecentlyViewed: (productId) => {
        set((state) => {
          // Remove if already exists to move to front
          const filtered = state.recentlyViewed.filter((id) => id !== productId)
          const updated = [productId, ...filtered].slice(0, MAX_RECENTLY_VIEWED)
          return { recentlyViewed: updated }
        })
      },
      
      clearRecentlyViewed: () => set({ recentlyViewed: [] }),
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        theme: state.theme,
        recentlyViewed: state.recentlyViewed,
      }),
    }
  )
)
