import { Metadata } from "next"
import Link from "next/link"
import {
  ShoppingCart,
  Search,
  Filter,
  Download,
  Eye,
  MoreVertical,
  Printer,
  CheckCircle,
  Clock,
  XCircle,
  Truck,
  Package,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import prisma from "@/lib/prisma"
import { formatDistanceToNow } from "date-fns"

export const metadata: Metadata = {
  title: "Orders - Admin Dashboard",
  description: "Manage customer orders",
}

async function getOrders() {
  try {
    const orders = await prisma.order.findMany({
      where: {
        isDeleted: false,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
    })
    return orders
  } catch (error) {
    console.error("Error fetching orders:", error)
    return []
  }
}

const statusConfig = {
  PENDING: {
    label: "Pending",
    icon: Clock,
    color: "bg-yellow-100 text-yellow-700",
    count: 0,
  },
  CONFIRMED: {
    label: "Confirmed",
    icon: CheckCircle,
    color: "bg-blue-100 text-blue-700",
    count: 0,
  },
  PROCESSING: {
    label: "Processing",
    icon: Package,
    color: "bg-purple-100 text-purple-700",
    count: 0,
  },
  SHIPPED: {
    label: "Shipped",
    icon: Truck,
    color: "bg-indigo-100 text-indigo-700",
    count: 0,
  },
  DELIVERED: {
    label: "Delivered",
    icon: CheckCircle,
    color: "bg-green-100 text-green-700",
    count: 0,
  },
  CANCELLED: {
    label: "Cancelled",
    icon: XCircle,
    color: "bg-red-100 text-red-700",
    count: 0,
  },
  REFUNDED: {
    label: "Refunded",
    icon: XCircle,
    color: "bg-gray-100 text-gray-700",
    count: 0,
  },
}

export default async function OrdersPage() {
  const orders = await getOrders()

  // Calculate status counts
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  Object.keys(statusConfig).forEach((status) => {
    statusConfig[status as keyof typeof statusConfig].count = statusCounts[status] || 0
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 mt-1">
            Manage and track customer orders ({orders.length} total)
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {Object.entries(statusConfig).map(([key, config]) => (
          <Card key={key}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <config.icon className="h-4 w-4 text-gray-500" />
                <p className="text-xs font-medium text-gray-500">{config.label}</p>
              </div>
              <p className="text-2xl font-bold">{config.count}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by order ID, customer name, or email..."
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table with Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>View and manage customer orders by status</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All ({orders.length})</TabsTrigger>
              {Object.entries(statusConfig).map(([key, config]) => (
                <TabsTrigger key={key} value={key.toLowerCase()}>
                  {config.label} ({config.count})
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <OrdersTable orders={orders} />
            </TabsContent>

            {Object.keys(statusConfig).map((status) => (
              <TabsContent key={status} value={status.toLowerCase()} className="space-y-4">
                <OrdersTable
                  orders={orders.filter((order) => order.status === status)}
                />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function OrdersTable({ orders }: { orders: any[] }) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
        <p className="text-gray-500">Orders will appear here once customers place them</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
              Order
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
              Customer
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
              Items
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
              Total
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
              Payment
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
              Status
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
              Date
            </th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const status = statusConfig[order.status as keyof typeof statusConfig]
            const customerName = order.user
              ? `${order.user.firstName || ""} ${order.user.lastName || ""}`.trim() ||
                "Unknown"
              : "Guest"

            return (
              <tr
                key={order.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4">
                  <div>
                    <p className="font-mono text-sm font-semibold text-gray-900">
                      {order.orderNumber}
                    </p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium text-gray-900">{customerName}</p>
                    <p className="text-sm text-gray-500">{order.email}</p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-600">
                    {order.items.length} {order.items.length === 1 ? "item" : "items"}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm font-semibold text-gray-900">
                    ${order.total.toFixed(2)}
                  </span>
                </td>
                <td className="py-3 px-4">
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
                </td>
                <td className="py-3 px-4">
                  <Badge className={status.color}>
                    <status.icon className="h-3 w-3 mr-1" />
                    {status.label}
                  </Badge>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/orders/${order.id}`}>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Printer className="h-4 w-4 mr-2" />
                          Print Invoice
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Printer className="h-4 w-4 mr-2" />
                          Print Packing Slip
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark as Confirmed
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Truck className="h-4 w-4 mr-2" />
                          Mark as Shipped
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <XCircle className="h-4 w-4 mr-2" />
                          Cancel Order
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
