import { Metadata } from "next"
import { notFound } from "next/navigation"
import { PromotionForm } from "@/components/admin/promotion-form"
import prisma from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Edit Promotion - Admin Dashboard",
  description: "Edit promotion details",
}

async function getPromotion(id: string) {
  try {
    const promotion = await prisma.promotion.findUnique({
      where: { id },
    })
    
    if (promotion) {
      return {
        ...promotion,
        startDate: promotion.startDate.toISOString().split("T")[0],
        endDate: promotion.endDate.toISOString().split("T")[0],
      }
    }
    return null
  } catch (error) {
    console.error("Error fetching promotion:", error)
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

export default async function EditPromotionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [promotion, categories, products] = await Promise.all([
    getPromotion(id),
    getCategories(),
    getProducts(),
  ])

  if (!promotion) {
    notFound()
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Promotion</h1>
        <p className="text-gray-500 mt-1">Update promotion details</p>
      </div>

      <PromotionForm
        categories={categories}
        products={products}
        initialData={promotion}
      />
    </div>
  )
}
