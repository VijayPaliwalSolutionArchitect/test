"use client"

import { useState } from "react"
import { Minus, Plus, ShoppingCart, Heart, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/stores"
import { useWishlistStore } from "@/stores"
import { toast } from "sonner"
import type { Product } from "@/types"

interface AddToCartButtonProps {
  product: Product & {
    variants?: Array<{
      id: string
      sku: string
      name: string
      attributes: Record<string, string>
      price: number
      stockQuantity: number
      isAvailable: boolean
    }>
  }
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  
  const addItem = useCartStore((state) => state.addItem)
  const openCart = useCartStore((state) => state.openCart)
  const toggleWishlist = useWishlistStore((state) => state.toggleItem)
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id))

  const mainImage = product.images?.[0]?.url || "/images/placeholder.png"

  const handleAddToCart = async () => {
    setIsLoading(true)
    
    try {
      addItem({
        productId: product.id,
        name: product.name,
        sku: product.sku,
        image: mainImage,
        price: product.price,
        quantity,
      })
      
      toast.success("Added to cart!", {
        description: `${quantity}x ${product.name} added to your cart.`,
        action: {
          label: "View Cart",
          onClick: () => openCart(),
        },
      })
    } catch {
      toast.error("Failed to add to cart")
    } finally {
      setIsLoading(false)
    }
  }

  const handleWishlistToggle = () => {
    toggleWishlist(product.id)
    toast.success(isInWishlist ? "Removed from wishlist" : "Added to wishlist")
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.shortDescription,
          url: window.location.href,
        })
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard!")
    }
  }

  const inStock = product.stockQuantity > 0

  return (
    <div className="space-y-4">
      {/* Quantity & Add to Cart */}
      <div className="flex items-center gap-4">
        {/* Quantity Selector */}
        <div className="flex items-center border rounded-xl overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-none h-12 w-12"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center font-medium">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-none h-12 w-12"
            onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
            disabled={quantity >= product.stockQuantity}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Add to Cart Button */}
        <Button
          size="lg"
          className="flex-1 h-12"
          onClick={handleAddToCart}
          disabled={!inStock || isLoading}
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          {!inStock ? "Out of Stock" : isLoading ? "Adding..." : "Add to Cart"}
        </Button>
      </div>

      {/* Secondary Actions */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          className="flex-1"
          onClick={handleWishlistToggle}
        >
          <Heart
            className={`h-5 w-5 mr-2 ${
              isInWishlist ? "fill-red-500 text-red-500" : ""
            }`}
          />
          {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
        </Button>
        <Button variant="outline" size="icon" onClick={handleShare}>
          <Share2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Stock Info */}
      {inStock && product.stockQuantity <= 10 && (
        <p className="text-sm text-orange-600">
          Only {product.stockQuantity} left in stock - order soon!
        </p>
      )}
    </div>
  )
}
