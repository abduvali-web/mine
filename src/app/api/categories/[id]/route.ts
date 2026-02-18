import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

type RouteParams = { params: Promise<{ id: string }> }

// GET single category
export async function GET(request: NextRequest, { params }: RouteParams) {
    const { id } = await params
    try {
        const category = await prisma.category.findUnique({
            where: { id },
            include: { products: true }
        })

        if (!category) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 })
        }

        return NextResponse.json(category)
    } catch (error) {
        console.error('Error fetching category:', error)
        return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 })
    }
}

// UPDATE category
export async function PUT(request: NextRequest, { params }: RouteParams) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    try {
        const data = await request.json()

        const category = await prisma.category.update({
            where: { id },
            data: {
                name: data.name,
                slug: data.slug,
                image: data.image,
                order: data.order
            }
        })

        return NextResponse.json(category)
    } catch (error) {
        console.error('Error updating category:', error)
        return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
    }
}

// DELETE category
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    try {
        // Check if category has products
        const productCount = await prisma.product.count({ where: { categoryId: id } })
        if (productCount > 0) {
            return NextResponse.json(
                { error: 'Cannot delete category with products. Remove products first.' },
                { status: 400 }
            )
        }

        await prisma.category.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting category:', error)
        return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
    }
}
