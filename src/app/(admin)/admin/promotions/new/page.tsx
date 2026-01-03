import { Metadata } from "next"
import { PromotionForm } from "@/components/admin/promotion-form"
import prisma from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Create Promotion - Admin Dashboard",
  description: "Create a new promotion or discount code",
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
      },
    })
    return categories
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isDeleted: false,
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        sku: true,
      },
      take: 100,
    })
    return products
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

export default async function NewPromotionPage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ])

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create Promotion</h1>
        <p className="text-gray-500 mt-1">
          Create a new promotion or discount code for your store
        </p>
      </div>

      <PromotionForm categories={categories} products={products} />
    </div>
  )
}
