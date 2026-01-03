import { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProductForm } from "@/components/admin/product-form"
import prisma from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Edit Product - Admin Dashboard",
  description: "Edit product details",
}

async function getProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    })
    return product
  } catch (error) {
    console.error("Error fetching product:", error)
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
    })
    return categories
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [product, categories] = await Promise.all([
    getProduct(id),
    getCategories(),
  ])

  if (!product) {
    notFound()
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-500 mt-1">Update product details</p>
      </div>

      <ProductForm categories={categories} initialData={product} />
    </div>
  )
}
