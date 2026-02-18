import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    try {
        const product = await prisma.product.findUnique({
            where: { id },
            include: { category: true }
        })
        if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
        return NextResponse.json(product)
        return NextResponse.json(product)
    } catch {
        return NextResponse.json({ error: 'Failed' }, { status: 500 })
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const { id } = await params
        const data = await request.json()
        const product = await prisma.product.update({
            where: { id },
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
        return NextResponse.json(product)
    } catch {
        return NextResponse.json({ error: 'Failed' }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const { id } = await params
        await prisma.product.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch {
        return NextResponse.json({ error: 'Failed' }, { status: 500 })
    }
}
