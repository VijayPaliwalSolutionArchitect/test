import { Metadata } from "next"
import { notFound } from "next/navigation"
import { CategoryForm } from "@/components/admin/category-form"
import prisma from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Edit Category - Admin Dashboard",
  description: "Edit category details",
}

async function getCategory(id: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
    })
    return category
  } catch (error) {
    console.error("Error fetching category:", error)
    return null
  }
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

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [category, categories] = await Promise.all([
    getCategory(id),
    getCategories(),
  ])

  if (!category) {
    notFound()
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Category</h1>
        <p className="text-gray-500 mt-1">Update category details</p>
      </div>

      <CategoryForm categories={categories} initialData={category} />
    </div>
  )
}
