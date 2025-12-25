import { Metadata } from "next"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { CheckoutForm } from "./checkout-form"
import { OrderSummary } from "./order-summary"

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your purchase",
}

export default function CheckoutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-purple-600">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/cart" className="hover:text-purple-600">Cart</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900">Checkout</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <CheckoutForm />
        </div>

        {/* Order Summary */}
        <div>
          <OrderSummary />
        </div>
      </div>
    </div>
  )
}
