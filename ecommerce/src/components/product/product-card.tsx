"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ShoppingCart, Heart, Eye, Star } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCartStore } from "@/stores"
import { useWishlistStore } from "@/stores"
import { formatPrice, calculateDiscount } from "@/lib/utils"
import { toast } from "sonner"
import type { Product } from "@/types"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const addItem = useCartStore((state) => state.addItem)
  const toggleWishlist = useWishlistStore((state) => state.toggleItem)
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id))
  
  const discount = product.comparePrice
    ? calculateDiscount(product.price, product.comparePrice)
    : 0
  
  const mainImage = product.images?.[0]?.url || "/images/placeholder.png"
  const hoverImage = product.images?.[1]?.url || mainImage
  
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLoading(true)
    
    try {
      addItem({
        productId: product.id,
        name: product.name,
        sku: product.sku,
        image: mainImage,
        price: product.price,
        quantity: 1,
      })
      
      toast.success("Added to cart!", {
        description: `${product.name} has been added to your cart.`,
      })
    } catch {
      toast.error("Failed to add to cart")
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product.id)
    
    toast.success(isInWishlist ? "Removed from wishlist" : "Added to wishlist", {
      description: isInWishlist
        ? `${product.name} has been removed from your wishlist.`
        : `${product.name} has been added to your wishlist.`,
    })
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      <Link href={`/products/${product.slug}`}>
        <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={isHovered ? hoverImage : mainImage}
              alt={product.name}
              fill
              className="object-cover transition-all duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {discount > 0 && (
                <Badge variant="destructive" className="font-bold">
                  -{discount}%
                </Badge>
              )}
              {product.isFeatured && (
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 border-0">
                  Featured
                </Badge>
              )}
              {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
                <Badge variant="warning">Only {product.stockQuantity} left</Badge>
              )}
              {product.stockQuantity === 0 && (
                <Badge variant="secondary">Out of Stock</Badge>
              )}
            </div>
            
            {/* Wishlist button */}
            <Button
              size="icon"
              variant="secondary"
              className={`absolute top-3 right-3 rounded-full backdrop-blur-xl transition-all duration-300 ${
                isHovered || isInWishlist ? "opacity-100" : "opacity-0"
              }`}
              onClick={handleWishlistToggle}
            >
              <Heart
                className={`h-4 w-4 transition-colors ${
                  isInWishlist ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </Button>
            
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                y: isHovered ? 0 : 20,
              }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-3 left-3 right-3 flex gap-2"
            >
              <Button
                size="sm"
                className="flex-1 backdrop-blur-xl"
                onClick={handleAddToCart}
                disabled={isLoading || product.stockQuantity === 0}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {product.stockQuantity === 0 ? "Out of Stock" : "Add to Cart"}
              </Button>
              
              <Button
                size="sm"
                variant="secondary"
                className="backdrop-blur-xl"
              >
                <Eye className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
          
          {/* Product Info */}
          <div className="p-5 space-y-3">
            {/* Brand */}
            <p className="text-xs font-medium text-purple-600 uppercase tracking-wider">
              {product.brand}
            </p>
            
            {/* Name */}
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-purple-600 transition-colors">
              {product.name}
            </h3>
            
            {/* Rating */}
            {product.ratingCount > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.ratingAverage)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">({product.ratingCount})</span>
              </div>
            )}
            
            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(product.price, product.currency)}
              </span>
              {product.comparePrice && (
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(product.comparePrice, product.currency)}
                </span>
              )}
            </div>
            
            {/* Tags */}
            {product.freeShipping && (
              <Badge variant="success" className="text-xs">
                Free Shipping
              </Badge>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
