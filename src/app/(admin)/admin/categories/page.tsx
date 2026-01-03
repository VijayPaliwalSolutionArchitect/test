import { Metadata } from "next"
import Link from "next/link"
import {
  FolderTree,
  Plus,
  Search,
  Edit,
  Trash2,
  MoreVertical,
  Eye,
  ChevronRight,
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

export const metadata: Metadata = {
  title: "Categories - Admin Dashboard",
  description: "Manage product categories",
}

async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isDeleted: false,
      },
      orderBy: [
        { level: "asc" },
        { displayOrder: "asc" },
        { name: "asc" },
      ],
    })
    return categories
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

import { CategoryTree } from "@/components/admin/category-tree"

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500 mt-1">
            Organize your products with categories ({categories.length} total)
          </p>
        </div>
        <Link href="/admin/categories/new">
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </Link>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search categories..."
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories Tree */}
      <Card>
        <CardHeader>
          <CardTitle>Category Hierarchy</CardTitle>
          <CardDescription>Manage your category structure</CardDescription>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <FolderTree className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No categories yet
              </h3>
              <p className="text-gray-500 mb-4">
                Create your first category to organize products
              </p>
              <Link href="/admin/categories/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </Link>
            </div>
          ) : (
            <CategoryTree categories={categories} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
