import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const item = await prisma.jewelryItem.findUnique({
            where: { id },
            include: {
                type: true
            }
        })

        if (!item) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 })
        }

        return NextResponse.json(item)
    } catch (error) {
        console.error('Error fetching jewelry item:', error)
        return NextResponse.json({ error: 'Failed to fetch jewelry item' }, { status: 500 })
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params
        const data = await req.json()

        const item = await prisma.jewelryItem.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
                price: parseFloat(data.price) || 0,
                compareAt: data.compareAt ? parseFloat(data.compareAt) : null,
                image: data.image,
                material: data.material,
                length: data.length,
                typeId: data.typeId,
                supportsCharms: data.supportsCharms,
                charmPositions: data.charmPositions,
                inStock: data.inStock,
                featured: data.featured,
            }
        })

        return NextResponse.json(item)
    } catch (error) {
        console.error('Error updating jewelry item:', error)
        return NextResponse.json({ error: 'Failed to update jewelry item' }, { status: 500 })
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params
        await prisma.jewelryItem.delete({ where: { id } })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting jewelry item:', error)
        return NextResponse.json({ error: 'Failed to delete jewelry item' }, { status: 500 })
    }
}
