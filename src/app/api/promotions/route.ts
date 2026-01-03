import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET /api/promotions - List all promotions
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const isActive = searchParams.get("isActive")

    const where: Record<string, unknown> = {}
    
    if (isActive !== null) {
      where.isActive = isActive === "true"
    }

    const promotions = await prisma.promotion.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({
      success: true,
      data: promotions,
    })
  } catch (error) {
    console.error("Error fetching promotions:", error)
    return NextResponse.json(
      { error: "Failed to fetch promotions" },
      { status: 500 }
    )
  }
}

// POST /api/promotions - Create promotion (Admin only)
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.discountValue || !body.startDate || !body.endDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const promotion = await prisma.promotion.create({
      data: {
        name: body.name,
        code: body.code || null,
        type: body.type,
        discountType: body.discountType,
        discountValue: parseFloat(body.discountValue),
        maxDiscount: body.maxDiscount ? parseFloat(body.maxDiscount) : null,
        minPurchaseAmount: body.minPurchaseAmount ? parseFloat(body.minPurchaseAmount) : null,
        maxPurchaseAmount: body.maxPurchaseAmount ? parseFloat(body.maxPurchaseAmount) : null,
        applicableProductIds: body.applicableProductIds || [],
        applicableCategoryIds: body.applicableCategoryIds || [],
        excludedProductIds: body.excludedProductIds || [],
        userSegments: body.userSegments || [],
        maxUsesPerUser: body.maxUsesPerUser ? parseInt(body.maxUsesPerUser) : null,
        newCustomersOnly: body.newCustomersOnly || false,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        isActive: body.isActive ?? true,
        maxTotalUses: body.maxTotalUses ? parseInt(body.maxTotalUses) : null,
        displayName: body.displayName || null,
        description: body.description || null,
        bannerImage: body.bannerImage || null,
        badgeText: body.badgeText || null,
        priority: body.priority || 0,
        canStackWithOthers: body.canStackWithOthers || false,
      },
    })

    return NextResponse.json(
      { success: true, data: promotion },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating promotion:", error)
    return NextResponse.json(
      { error: "Failed to create promotion" },
      { status: 500 }
    )
  }
}
