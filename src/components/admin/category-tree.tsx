"use client"

import { useState } from "react"
import Link from "next/link"
import {
  FolderTree,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  Eye,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Category {
  id: string
  name: string
  slug: string
  image?: string | null
  productCount: number
  isFeatured: boolean
  isVisible: boolean
  parentId?: string | null
  children?: Category[]
}

interface CategoryTreeProps {
  categories: Category[]
}

export function CategoryTree({ categories }: CategoryTreeProps) {
  // Build category tree
  const categoryMap = new Map()
  const rootCategories: Category[] = []

  categories.forEach((cat) => {
    categoryMap.set(cat.id, { ...cat, children: [] })
  })

  categories.forEach((cat) => {
    if (cat.parentId && categoryMap.has(cat.parentId)) {
      categoryMap.get(cat.parentId).children.push(categoryMap.get(cat.id))
    } else if (!cat.parentId) {
      rootCategories.push(categoryMap.get(cat.id))
    }
  })

  return (
    <div className="space-y-2">
      {rootCategories.map((category) => (
        <CategoryTreeItem key={category.id} category={category} level={0} />
      ))}
    </div>
  )
}

function CategoryTreeItem({ category, level }: { category: Category; level: number }) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div>
      <div
        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
        style={{ marginLeft: level > 0 ? `${level * 1.5}rem` : 0 }}
      >
        {category.children && category.children.length > 0 ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-200 rounded"
          >
            <ChevronRight
              className={`h-4 w-4 transition-transform ${
                isExpanded ? "rotate-90" : ""
              }`}
            />
          </button>
        ) : (
          <div className="w-6" />
        )}

        <div className="flex items-center gap-3 flex-1">
          {category.image ? (
            <img
              src={category.image}
              alt={category.name}
              className="w-10 h-10 rounded-lg object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <FolderTree className="h-5 w-5 text-gray-400" />
            </div>
          )}
          <div className="flex-1">
            <p className="font-medium text-gray-900">{category.name}</p>
            <p className="text-sm text-gray-500">{category.slug}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary">{category.productCount} products</Badge>
          {category.isFeatured && (
            <Badge className="bg-purple-100 text-purple-700">Featured</Badge>
          )}
          {!category.isVisible && <Badge variant="outline">Hidden</Badge>}
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/admin/categories/${category.id}/edit`}>
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
                <Plus className="h-4 w-4 mr-2" />
                Add Subcategory
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Eye className="h-4 w-4 mr-2" />
                View Products
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {isExpanded && category.children && category.children.length > 0 && (
        <div>
          {category.children.map((child) => (
            <CategoryTreeItem key={child.id} category={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}
