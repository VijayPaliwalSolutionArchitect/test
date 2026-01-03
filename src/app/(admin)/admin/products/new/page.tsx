import { Metadata } from "next"
import { ProductForm } from "@/components/admin/product-form"
import prisma from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Add New Product - Admin Dashboard",
  description: "Create a new product",
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
    })
    return categories
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export default async function NewProductPage() {
  const categories = await getCategories()

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-gray-500 mt-1">Create a new product for your store</p>
      </div>

      <ProductForm categories={categories} />
    </div>
  )
}
