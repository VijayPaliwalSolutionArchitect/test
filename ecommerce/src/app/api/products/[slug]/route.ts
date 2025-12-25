import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { CACHE_KEYS, getOrSet, CACHE_TTL, invalidateCache } from "@/lib/redis"

// GET /api/products/[slug] - Get single product
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    // Try cache first
    const product = await getOrSet(
      CACHE_KEYS.product(slug),
      async () => {
        const product = await prisma.product.findUnique({
          where: { slug },
          include: {
            category: true,
            reviews: {
              where: { status: "APPROVED" },
              take: 10,
              orderBy: { createdAt: "desc" },
              include: {
                user: {
                  select: {
                    displayName: true,
                    avatar: true,
                  },
                },
              },
            },
          },
        })
        return product
      },
      CACHE_TTL.product
    )

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    // Increment view count (don't await to not block response)
    prisma.product.update({
      where: { id: product.id },
      data: { viewCount: { increment: 1 } },
    }).catch(console.error)

    return NextResponse.json({ success: true, data: product })
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    )
  }
}

// PUT /api/products/[slug] - Update product (Admin only)
export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const body = await request.json()

    const product = await prisma.product.update({
      where: { slug },
      data: body,
    })

    // Invalidate cache
    await invalidateCache(CACHE_KEYS.product(slug))

    return NextResponse.json({ success: true, data: product })
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[slug] - Soft delete product (Admin only)
export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    await prisma.product.update({
      where: { slug },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    })

    // Invalidate cache
    await invalidateCache(CACHE_KEYS.product(slug))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    )
  }
}
