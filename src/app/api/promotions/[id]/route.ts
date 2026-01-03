import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET /api/promotions/[id] - Get single promotion
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const promotion = await prisma.promotion.findUnique({
      where: { id },
    })

    if (!promotion) {
      return NextResponse.json(
        { error: "Promotion not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: promotion })
  } catch (error) {
    console.error("Error fetching promotion:", error)
    return NextResponse.json(
      { error: "Failed to fetch promotion" },
      { status: 500 }
    )
  }
}

// PUT /api/promotions/[id] - Update promotion (Admin only)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const promotion = await prisma.promotion.update({
      where: { id },
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

    return NextResponse.json({ success: true, data: promotion })
  } catch (error) {
    console.error("Error updating promotion:", error)
    return NextResponse.json(
      { error: "Failed to update promotion" },
      { status: 500 }
    )
  }
}

// DELETE /api/promotions/[id] - Delete promotion (Admin only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.promotion.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting promotion:", error)
    return NextResponse.json(
      { error: "Failed to delete promotion" },
      { status: 500 }
    )
  }
}
