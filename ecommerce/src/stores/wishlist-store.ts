import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistItem {
  productId: string
  addedAt: Date
}

interface WishlistState {
  items: WishlistItem[]
  isLoading: boolean
  
  // Actions
  addItem: (productId: string) => void
  removeItem: (productId: string) => void
  toggleItem: (productId: string) => void
  clearWishlist: () => void
  isInWishlist: (productId: string) => boolean
  setLoading: (loading: boolean) => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      
      addItem: (productId) => {
        set((state) => {
          if (state.items.some((i) => i.productId === productId)) {
            return state
          }
          return {
            items: [...state.items, { productId, addedAt: new Date() }],
          }
        })
      },
      
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }))
      },
      
      toggleItem: (productId) => {
        const { isInWishlist, addItem, removeItem } = get()
        if (isInWishlist(productId)) {
          removeItem(productId)
        } else {
          addItem(productId)
        }
      },
      
      clearWishlist: () => set({ items: [] }),
      
      isInWishlist: (productId) => {
        return get().items.some((i) => i.productId === productId)
      },
      
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'wishlist-storage',
    }
  )
)
