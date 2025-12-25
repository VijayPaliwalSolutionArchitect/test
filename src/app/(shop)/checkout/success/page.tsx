import Link from "next/link"
import { CheckCircle, Package, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { order?: string }
}) {
  const orderNumber = searchParams.order || "ORD-XXXXXX"

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="mb-8">
        <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-600">Thank you for your purchase. Your order has been received.</p>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Package className="h-6 w-6 text-purple-600" />
            <span className="text-lg font-semibold">Order #{orderNumber}</span>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            A confirmation email has been sent to your email address.
          </p>
          <div className="bg-purple-50 rounded-xl p-4">
            <p className="text-sm font-medium text-purple-800">Estimated Delivery</p>
            <p className="text-lg font-bold text-purple-900">3-5 Business Days</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild>
          <Link href="/orders">Track Order <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  )
}
