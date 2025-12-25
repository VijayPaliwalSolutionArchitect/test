import { Metadata } from "next"
import Link from "next/link"
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Manage your e-commerce store",
}

// Mock data
const stats = [
  {
    name: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    trend: "up",
    icon: DollarSign,
  },
  {
    name: "Orders",
    value: "2,345",
    change: "+15.2%",
    trend: "up",
    icon: ShoppingCart,
  },
  {
    name: "Products",
    value: "1,234",
    change: "+5.4%",
    trend: "up",
    icon: Package,
  },
  {
    name: "Customers",
    value: "12,456",
    change: "+12.3%",
    trend: "up",
    icon: Users,
  },
]

const recentOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    email: "john@example.com",
    amount: "$299.99",
    status: "completed",
    date: "2 min ago",
  },
  {
    id: "ORD-002",
    customer: "Sarah Smith",
    email: "sarah@example.com",
    amount: "$149.50",
    status: "processing",
    date: "15 min ago",
  },
  {
    id: "ORD-003",
    customer: "Mike Johnson",
    email: "mike@example.com",
    amount: "$599.00",
    status: "pending",
    date: "1 hour ago",
  },
  {
    id: "ORD-004",
    customer: "Emily Brown",
    email: "emily@example.com",
    amount: "$89.99",
    status: "cancelled",
    date: "2 hours ago",
  },
]

const lowStockProducts = [
  { name: "Premium Headphones", stock: 5, threshold: 10 },
  { name: "Smart Watch Pro", stock: 3, threshold: 15 },
  { name: "Wireless Keyboard", stock: 8, threshold: 20 },
]

const systemAlerts = [
  {
    type: "warning",
    title: "Low Stock Alert",
    message: "5 products are running low on stock",
  },
  {
    type: "info",
    title: "New Review Pending",
    message: "3 product reviews awaiting moderation",
  },
  {
    type: "success",
    title: "Daily Backup Complete",
    message: "System backup completed successfully",
  },
]

const recentMessages = [
  {
    name: "Alice Cooper",
    subject: "Question about order",
    preview: "Hi, I wanted to ask about my recent order...",
    time: "5 min ago",
    unread: true,
  },
  {
    name: "Bob Wilson",
    subject: "Return request",
    preview: "I'd like to return the product I purchased...",
    time: "30 min ago",
    unread: true,
  },
  {
    name: "Carol Davis",
    subject: "Product inquiry",
    preview: "Is the product available in blue color?",
    time: "1 hour ago",
    unread: false,
  },
]

const statusConfig = {
  completed: { label: "Completed", icon: CheckCircle, color: "text-green-600 bg-green-100" },
  processing: { label: "Processing", icon: Clock, color: "text-blue-600 bg-blue-100" },
  pending: { label: "Pending", icon: Clock, color: "text-yellow-600 bg-yellow-100" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "text-red-600 bg-red-100" },
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        stat.trend === "up" ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-400">vs last month</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100">
                  <stat.icon className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/admin/products/new">
              <Button variant="outline" className="w-full h-20 flex-col gap-2">
                <Package className="h-6 w-6" />
                Add Product
              </Button>
            </Link>
            <Link href="/admin/orders">
              <Button variant="outline" className="w-full h-20 flex-col gap-2">
                <ShoppingCart className="h-6 w-6" />
                View Orders
              </Button>
            </Link>
            <Link href="/admin/promotions/new">
              <Button variant="outline" className="w-full h-20 flex-col gap-2">
                <DollarSign className="h-6 w-6" />
                Create Promo
              </Button>
            </Link>
            <Link href="/admin/analytics">
              <Button variant="outline" className="w-full h-20 flex-col gap-2">
                <TrendingUp className="h-6 w-6" />
                View Analytics
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest orders from your store</CardDescription>
            </div>
            <Link href="/admin/orders">
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => {
                const status = statusConfig[order.status as keyof typeof statusConfig]
                return (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                        {order.customer.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{order.customer}</p>
                        <p className="text-sm text-gray-500">{order.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{order.amount}</p>
                      <Badge className={status.color}>
                        <status.icon className="h-3 w-3 mr-1" />
                        {status.label}
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>Important notifications</CardDescription>
            </div>
            <Link href="/admin/alerts">
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemAlerts.map((alert, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border ${
                    alert.type === "warning"
                      ? "bg-yellow-50 border-yellow-200"
                      : alert.type === "success"
                      ? "bg-green-50 border-green-200"
                      : "bg-blue-50 border-blue-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle
                      className={`h-5 w-5 ${
                        alert.type === "warning"
                          ? "text-yellow-600"
                          : alert.type === "success"
                          ? "text-green-600"
                          : "text-blue-600"
                      }`}
                    />
                    <p className="font-medium">{alert.title}</p>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Low Stock Alert */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Low Stock Products</CardTitle>
              <CardDescription>Products that need restocking</CardDescription>
            </div>
            <Link href="/admin/products?filter=low-stock">
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockProducts.map((product) => (
                <div key={product.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{product.name}</span>
                    <span className="text-red-600 font-medium">
                      {product.stock} / {product.threshold}
                    </span>
                  </div>
                  <Progress
                    value={(product.stock / product.threshold) * 100}
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Messages</CardTitle>
              <CardDescription>Customer inquiries</CardDescription>
            </div>
            <Link href="/admin/messages">
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMessages.map((message, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl transition-colors ${
                    message.unread
                      ? "bg-purple-50 border border-purple-100"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium flex items-center gap-2">
                        {message.name}
                        {message.unread && (
                          <span className="w-2 h-2 rounded-full bg-purple-600" />
                        )}
                      </p>
                      <p className="text-sm font-medium text-gray-700">
                        {message.subject}
                      </p>
                      <p className="text-sm text-gray-500 line-clamp-1">
                        {message.preview}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {message.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
