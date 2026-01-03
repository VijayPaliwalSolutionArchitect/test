import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Package, Eye, Truck, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import prisma from "@/lib/prisma"
import { format } from "date-fns"

export const metadata: Metadata = {
  title: "Order History",
  description: "View your order history",
}

async function getOrders() {
  try {
    // In production, get userId from session
    // For now, return empty array
    return []
  } catch (error) {
    console.error("Error fetching orders:", error)
    return []
  }
}

const statusConfig = {
  PENDING: { label: "Pending", color: "bg-yellow-100 text-yellow-700" },
  CONFIRMED: { label: "Confirmed", color: "bg-blue-100 text-blue-700" },
  PROCESSING: { label: "Processing", color: "bg-purple-100 text-purple-700" },
  SHIPPED: { label: "Shipped", color: "bg-indigo-100 text-indigo-700" },
  DELIVERED: { label: "Delivered", color: "bg-green-100 text-green-700" },
  CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-700" },
  REFUNDED: { label: "Refunded", color: "bg-gray-100 text-gray-700" },
}

export default async function OrdersPage() {
  const orders = await getOrders()

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/account">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Account
            </Button>
          </Link>
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
        <p className="text-gray-500 mt-1">
          View and track your orders ({orders.length} orders)
        </p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">
              You haven't placed any orders yet. Start shopping to see your orders here!
            </p>
            <Link href="/products">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                Start Shopping
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => {
            const status = statusConfig[order.status as keyof typeof statusConfig]

            return (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        Order {order.orderNumber}
                      </CardTitle>
                      <CardDescription>
                        Placed on {format(new Date(order.createdAt), "PPP")}
                      </CardDescription>
                    </div>
                    <Badge className={status.color}>{status.label}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Order Items */}
                    <div className="space-y-3">
                      {order.items.map((item: any) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 p-3 rounded-lg bg-gray-50"
                        >
                          <div className="w-16 h-16 rounded-lg bg-white flex items-center justify-center overflow-hidden">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package className="h-6 w-6 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              ${item.subtotal.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Summary */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">
                          {order.items.length} {order.items.length === 1 ? "item" : "items"}
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          ${order.total.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {order.trackingNumber && (
                          <Button variant="outline" size="sm">
                            <Truck className="h-4 w-4 mr-2" />
                            Track Order
                          </Button>
                        )}
                        <Link href={`/account/orders/${order.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
