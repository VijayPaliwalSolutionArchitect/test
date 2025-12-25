import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { CACHE_KEYS, getOrSet, CACHE_TTL, invalidateCache } from "@/lib/redis"

// GET /api/products - List products with filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get("page") || "1")
    const pageSize = parseInt(searchParams.get("pageSize") || "12")
    const categoryId = searchParams.get("categoryId")
    const brand = searchParams.get("brand")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const sortBy = searchParams.get("sortBy") || "newest"
    const search = searchParams.get("search")
    const featured = searchParams.get("featured")
    const inStock = searchParams.get("inStock")

    // Build where clause
    const where: Record<string, unknown> = {
      isDeleted: false,
      isVisible: true,
      status: "ACTIVE",
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (brand) {
      where.brand = { in: brand.split(",") }
    }

    if (minPrice || maxPrice) {
      where.price = {
        ...(minPrice && { gte: parseFloat(minPrice) }),
        ...(maxPrice && { lte: parseFloat(maxPrice) }),
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
        { tags: { hasSome: [search.toLowerCase()] } },
      ]
    }

    if (featured === "true") {
      where.isFeatured = true
    }

    if (inStock === "true") {
      where.stockQuantity = { gt: 0 }
    }

    // Build orderBy
    let orderBy: Record<string, string> = { createdAt: "desc" }
    switch (sortBy) {
      case "price_asc":
        orderBy = { price: "asc" }
        break
      case "price_desc":
        orderBy = { price: "desc" }
        break
      case "popular":
        orderBy = { purchaseCount: "desc" }
        break
      case "rating":
        orderBy = { ratingAverage: "desc" }
        break
    }

    // Fetch products
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}

// POST /api/products - Create product (Admin only)
export async function POST(request: Request) {
  try {
    // In production, check admin auth:
    // const session = await auth()
    // if (session?.user?.role !== 'ADMIN') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const body = await request.json()

    const product = await prisma.product.create({
      data: {
        ...body,
        images: body.images || [],
      },
    })

    // Invalidate related caches
    await invalidateCache(CACHE_KEYS.productHot())

    return NextResponse.json(
      { success: true, data: product },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    )
  }
}
