"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CreditCard, Truck, Banknote, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCartStore } from "@/stores"
import { toast } from "sonner"
import { generateOrderNumber } from "@/lib/utils"

const checkoutSchema = z.object({
  email: z.string().email("Valid email required"),
  firstName: z.string().min(2, "First name required"),
  lastName: z.string().min(2, "Last name required"),
  phone: z.string().min(10, "Valid phone required"),
  address: z.string().min(5, "Address required"),
  city: z.string().min(2, "City required"),
  state: z.string().min(2, "State required"),
  postalCode: z.string().min(4, "Postal code required"),
  country: z.string().min(2, "Country required"),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

export function CheckoutForm() {
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const clearCart = useCartStore((state) => state.clearCart)
  const items = useCartStore((state) => state.items)

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { country: "United States" },
  })

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const orderNumber = generateOrderNumber()

      // In production: Call /api/orders to create order
      // const response = await fetch('/api/orders', { method: 'POST', body: JSON.stringify({...}) })

      clearCart()
      toast.success("Order placed successfully!")
      router.push(`/checkout/success?order=${orderNumber}`)
    } catch (error) {
      toast.error("Payment failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register("phone")} />
              {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipping */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" /> Shipping Address
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" {...register("firstName")} />
              {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>}
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" {...register("lastName")} />
              {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input id="address" {...register("address")} />
            {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>}
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register("city")} />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input id="state" {...register("state")} />
            </div>
            <div>
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input id="postalCode" {...register("postalCode")} />
            </div>
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Input id="country" {...register("country")} />
          </div>
        </CardContent>
      </Card>

      {/* Payment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" /> Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="card">Credit Card</TabsTrigger>
              <TabsTrigger value="upi">UPI</TabsTrigger>
              <TabsTrigger value="cod">Cash on Delivery</TabsTrigger>
            </TabsList>
            <TabsContent value="card" className="space-y-4">
              <div>
                <Label>Card Number</Label>
                <Input placeholder="4242 4242 4242 4242" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Expiry</Label>
                  <Input placeholder="MM/YY" />
                </div>
                <div>
                  <Label>CVC</Label>
                  <Input placeholder="123" />
                </div>
              </div>
              <p className="text-xs text-gray-500">*Demo mode - no real payment processed</p>
            </TabsContent>
            <TabsContent value="upi">
              <div>
                <Label>UPI ID</Label>
                <Input placeholder="yourname@upi" />
              </div>
            </TabsContent>
            <TabsContent value="cod">
              <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl">
                <Banknote className="h-6 w-6 text-amber-600" />
                <p className="text-sm">Pay with cash when your order is delivered. Additional ₹40 COD fee applies.</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Button type="submit" size="lg" className="w-full" disabled={isProcessing || items.length === 0}>
        {isProcessing ? (
          <><Loader2 className="h-5 w-5 animate-spin mr-2" /> Processing...</>
        ) : (
          "Place Order"
        )}
      </Button>
    </form>
  )
}
