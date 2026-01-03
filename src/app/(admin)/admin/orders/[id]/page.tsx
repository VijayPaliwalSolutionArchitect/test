import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Printer,
  Mail,
  CheckCircle,
  Truck,
  XCircle,
  DollarSign,
  Package,
  MapPin,
  CreditCard,
  User,
  Phone,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import prisma from "@/lib/prisma"
import { format } from "date-fns"

export const metadata: Metadata = {
  title: "Order Details - Admin Dashboard",
  description: "View order details",
}

async function getOrder(id: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: true,
              },
            },
          },
        },
      },
    })
    return order
  } catch (error) {
    console.error("Error fetching order:", error)
    return null
  }
}

const statusConfig = {
  PENDING: { label: "Pending", icon: CheckCircle, color: "bg-yellow-100 text-yellow-700" },
  CONFIRMED: { label: "Confirmed", icon: CheckCircle, color: "bg-blue-100 text-blue-700" },
  PROCESSING: { label: "Processing", icon: Package, color: "bg-purple-100 text-purple-700" },
  SHIPPED: { label: "Shipped", icon: Truck, color: "bg-indigo-100 text-indigo-700" },
  DELIVERED: { label: "Delivered", icon: CheckCircle, color: "bg-green-100 text-green-700" },
  CANCELLED: { label: "Cancelled", icon: XCircle, color: "bg-red-100 text-red-700" },
  REFUNDED: { label: "Refunded", icon: XCircle, color: "bg-gray-100 text-gray-700" },
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const order = await getOrder(id)

  if (!order) {
    notFound()
  }

  const status = statusConfig[order.status as keyof typeof statusConfig]
  const shippingAddress = order.shippingAddress as any
  const customerName = order.user
    ? `${order.user.firstName || ""} ${order.user.lastName || ""}`.trim() || "Unknown"
    : "Guest"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order {order.orderNumber}</h1>
            <p className="text-gray-500 mt-1">
              Placed on {format(new Date(order.createdAt), "PPP 'at' p")}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Mail className="h-4 w-4 mr-2" />
            Email Customer
          </Button>
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print Invoice
          </Button>
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print Packing Slip
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
              <CardDescription>{order.items.length} items in this order</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => {
                  const images = item.product.images as any
                  const imageUrl = images?.[0]?.url || "/placeholder-product.png"

                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-gray-50"
                    >
                      <div className="w-20 h-20 rounded-lg bg-white flex items-center justify-center overflow-hidden">
                        {imageUrl !== "/placeholder-product.png" ? (
                          <img
                            src={imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <Link
                          href={`/products/${item.product.slug}`}
                          target="_blank"
                          className="font-medium text-gray-900 hover:text-purple-600"
                        >
                          {item.name}
                        </Link>
                        <p className="text-sm text-gray-500 mt-1">SKU: {item.sku}</p>
                        {item.variantId && (
                          <p className="text-sm text-gray-500">Variant ID: {item.variantId}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        <p className="font-semibold text-gray-900">
                          ${item.price.toFixed(2)} each
                        </p>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          Total: ${item.subtotal.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <Separator className="my-6" />

              {/* Order Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">${order.subtotal.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green-600">-${order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">${order.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">${order.tax.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-xl text-gray-900">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
              <CardDescription>Status history and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <TimelineItem
                  icon={CheckCircle}
                  title="Order Placed"
                  time={format(new Date(order.createdAt), "PPP 'at' p")}
                  status="completed"
                />
                {order.paidAt && (
                  <TimelineItem
                    icon={DollarSign}
                    title="Payment Confirmed"
                    time={format(new Date(order.paidAt), "PPP 'at' p")}
                    status="completed"
                  />
                )}
                {order.fulfilledAt && (
                  <TimelineItem
                    icon={Package}
                    title="Order Fulfilled"
                    time={format(new Date(order.fulfilledAt), "PPP 'at' p")}
                    status="completed"
                  />
                )}
                {order.deliveredAt && (
                  <TimelineItem
                    icon={Truck}
                    title="Order Delivered"
                    time={format(new Date(order.deliveredAt), "PPP 'at' p")}
                    status="completed"
                  />
                )}
                {order.cancelledAt && (
                  <TimelineItem
                    icon={XCircle}
                    title="Order Cancelled"
                    time={format(new Date(order.cancelledAt), "PPP 'at' p")}
                    status="cancelled"
                    description={order.cancelReason}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Current Status</span>
                <Badge className={status.color}>
                  <status.icon className="h-3 w-3 mr-1" />
                  {status.label}
                </Badge>
              </div>
              
              <Separator />

              <div className="space-y-2">
                <Button className="w-full" variant="outline">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Confirmed
                </Button>
                <Button className="w-full" variant="outline">
                  <Package className="h-4 w-4 mr-2" />
                  Mark as Processing
                </Button>
                <Button className="w-full" variant="outline">
                  <Truck className="h-4 w-4 mr-2" />
                  Mark as Shipped
                </Button>
                <Button className="w-full" variant="outline">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Delivered
                </Button>
              </div>

              <Separator />

              <div className="space-y-2">
                <Button className="w-full" variant="outline">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Process Refund
                </Button>
                <Button className="w-full" variant="outline" className="text-red-600">
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel Order
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                  {customerName.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{customerName}</p>
                  <Link
                    href={`/admin/customers/${order.userId}`}
                    className="text-sm text-purple-600 hover:underline"
                  >
                    View profile
                  </Link>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{order.email}</span>
                </div>
                {order.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{order.phone}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm text-gray-600">
                <p className="font-medium text-gray-900">
                  {shippingAddress.firstName} {shippingAddress.lastName}
                </p>
                <p>{shippingAddress.addressLine1}</p>
                {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
                <p>
                  {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
                </p>
                <p>{shippingAddress.country}</p>
                {shippingAddress.phone && <p className="mt-2">{shippingAddress.phone}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Method</span>
                <Badge variant="outline">{order.paymentMethod}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <Badge
                  className={
                    order.paymentStatus === "CAPTURED"
                      ? "bg-green-100 text-green-700"
                      : order.paymentStatus === "PENDING"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }
                >
                  {order.paymentStatus}
                </Badge>
              </div>
              {order.transactionId && (
                <div>
                  <p className="text-sm text-gray-600">Transaction ID</p>
                  <p className="text-sm font-mono text-gray-900 mt-1">
                    {order.transactionId}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Shipping Info */}
          {order.trackingNumber && (
            <Card>
              <CardHeader>
                <CardTitle>Shipping</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {order.shippingCarrier && (
                  <div>
                    <p className="text-sm text-gray-600">Carrier</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {order.shippingCarrier}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Tracking Number</p>
                  <p className="text-sm font-mono text-gray-900 mt-1">
                    {order.trackingNumber}
                  </p>
                  {order.trackingUrl && (
                    <a
                      href={order.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-purple-600 hover:underline mt-1 inline-block"
                    >
                      Track shipment →
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function TimelineItem({
  icon: Icon,
  title,
  time,
  status,
  description,
}: {
  icon: any
  title: string
  time: string
  status: "completed" | "cancelled"
  description?: string | null
}) {
  return (
    <div className="flex gap-4">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          status === "completed"
            ? "bg-green-100 text-green-600"
            : "bg-red-100 text-red-600"
        }`}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{time}</p>
        {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
      </div>
    </div>
  )
}
