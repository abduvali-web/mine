import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            include: { category: true },
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json(products)
    } catch {
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const data = await request.json()
        const product = await prisma.product.create({
            data: {
                name: data.name,
                slug: data.slug,
                description: data.description,
                price: parseFloat(data.price),
                compareAt: data.compareAt ? parseFloat(data.compareAt) : null,
                images: JSON.stringify(data.images || []),
                categoryId: data.categoryId,
                sizes: JSON.stringify(data.sizes || []),
                featured: !!data.featured,
                inStock: !!data.inStock
            }
        })
        return NextResponse.json(product)
    } catch {
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
    }
}
