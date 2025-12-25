"use client"

import Link from "next/link"
import Image from "next/image"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useCartStore, selectCartItemCount } from "@/stores"
import { formatPrice } from "@/lib/utils"
import { useState } from "react"
import { toast } from "sonner"

export function CartPageClient() {
  const items = useCartStore((state) => state.items)
  const subtotal = useCartStore((state) => state.subtotal)
  const discount = useCartStore((state) => state.discount)
  const shipping = useCartStore((state) => state.shipping)
  const tax = useCartStore((state) => state.tax)
  const total = useCartStore((state) => state.total)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const applyCoupon = useCartStore((state) => state.applyCoupon)
  const [couponCode, setCouponCode] = useState("")

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "SAVE10") {
      applyCoupon({ code: "SAVE10", discountAmount: subtotal * 0.1, promotionId: "promo1" })
      toast.success("Coupon applied! 10% off")
      setCouponCode("")
    } else {
      toast.error("Invalid coupon code")
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingBag className="h-20 w-20 mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-600 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some products to get started</p>
        <Button asChild><Link href="/products">Browse Products</Link></Button>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                  <Image src={item.image || "/images/placeholder.png"} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                  <p className="font-semibold text-purple-600 mt-1">{formatPrice(item.price)}</p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center border rounded-lg">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="font-bold">{formatPrice(item.subtotal)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary */}
      <div>
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Coupon */}
            <div className="flex gap-2">
              <Input placeholder="Coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
              <Button variant="outline" onClick={handleApplyCoupon}>Apply</Button>
            </div>
            <p className="text-xs text-gray-500">Try: SAVE10</p>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span><span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>Shipping</span><span>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span><span>{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total</span><span>{formatPrice(total)}</span>
              </div>
            </div>

            <Button className="w-full" size="lg" asChild>
              <Link href="/checkout">Checkout <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
