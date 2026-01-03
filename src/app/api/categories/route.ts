import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET /api/categories - List all categories
export async function GET(request: Request) {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isDeleted: false,
      },
      orderBy: [
        { level: "asc" },
        { displayOrder: "asc" },
        { name: "asc" },
      ],
    })

    return NextResponse.json({
      success: true,
      data: categories,
    })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    )
  }
}

// POST /api/categories - Create category (Admin only)
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Calculate category path and level
    let path = body.slug
    let level = 0

    if (body.parentId) {
      const parent = await prisma.category.findUnique({
        where: { id: body.parentId },
      })
      if (parent) {
        path = `${parent.path}/${body.slug}`
        level = parent.level + 1
      }
    }

    const category = await prisma.category.create({
      data: {
        ...body,
        path,
        level,
      },
    })

    return NextResponse.json(
      { success: true, data: category },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    )
  }
}
