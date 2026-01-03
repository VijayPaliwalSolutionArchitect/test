import { Metadata } from "next"
import { CategoryForm } from "@/components/admin/category-form"
import prisma from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Add New Category - Admin Dashboard",
  description: "Create a new product category",
}

async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isDeleted: false,
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    })
    return categories
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export default async function NewCategoryPage() {
  const categories = await getCategories()

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Add New Category</h1>
        <p className="text-gray-500 mt-1">Create a new product category</p>
      </div>

      <CategoryForm categories={categories} />
    </div>
  )
}
