import { Metadata } from "next"
import Link from "next/link"
import {
  Tag,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  MoreVertical,
  Copy,
  BarChart,
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
import prisma from "@/lib/prisma"
import { format } from "date-fns"

export const metadata: Metadata = {
  title: "Promotions & Coupons - Admin Dashboard",
  description: "Manage promotions and discount codes",
}

async function getPromotions() {
  try {
    const promotions = await prisma.promotion.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
    })
    return promotions
  } catch (error) {
    console.error("Error fetching promotions:", error)
    return []
  }
}

export default async function PromotionsPage() {
  const promotions = await getPromotions()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Promotions & Coupons</h1>
          <p className="text-gray-500 mt-1">
            Create and manage discount codes ({promotions.length} total)
          </p>
        </div>
        <Link href="/admin/promotions/new">
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
            <Plus className="h-4 w-4 mr-2" />
            Create Promotion
          </Button>
        </Link>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search promotions by name or code..."
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

      {/* Promotions List */}
      <Card>
        <CardHeader>
          <CardTitle>All Promotions</CardTitle>
          <CardDescription>Manage discount codes and offers</CardDescription>
        </CardHeader>
        <CardContent>
          {promotions.length === 0 ? (
            <div className="text-center py-12">
              <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No promotions yet
              </h3>
              <p className="text-gray-500 mb-4">
                Create your first promotion to offer discounts to customers
              </p>
              <Link href="/admin/promotions/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Promotion
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Code
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Discount
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Usage
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Period
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Status
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {promotions.map((promotion) => {
                    const isActive =
                      promotion.isActive &&
                      new Date(promotion.startDate) <= new Date() &&
                      new Date(promotion.endDate) >= new Date()

                    return (
                      <tr
                        key={promotion.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              {promotion.name}
                            </p>
                            {promotion.description && (
                              <p className="text-sm text-gray-500 line-clamp-1">
                                {promotion.description}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {promotion.code ? (
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                {promotion.code}
                              </span>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">
                              Auto-apply
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm font-medium text-gray-900">
                            {promotion.discountType === "PERCENTAGE"
                              ? `${promotion.discountValue}%`
                              : `$${promotion.discountValue}`}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm">
                            <p className="font-medium text-gray-900">
                              {promotion.currentUsageCount}
                              {promotion.maxTotalUses && ` / ${promotion.maxTotalUses}`}
                            </p>
                            <p className="text-gray-500">uses</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-gray-600">
                            <p>{format(new Date(promotion.startDate), "MMM d")}</p>
                            <p>to {format(new Date(promotion.endDate), "MMM d")}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            className={
                              isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }
                          >
                            {isActive ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/admin/promotions/${promotion.id}/edit`}>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
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
                                  <Copy className="h-4 w-4 mr-2" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <BarChart className="h-4 w-4 mr-2" />
                                  View Analytics
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}
