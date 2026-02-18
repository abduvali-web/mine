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
        const charm = await prisma.charm.findUnique({
            where: { id }
        })

        if (!charm) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 })
        }

        return NextResponse.json(charm)
    } catch (error) {
        console.error('Error fetching charm:', error)
        return NextResponse.json({ error: 'Failed to fetch charm' }, { status: 500 })
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

        const charm = await prisma.charm.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
                price: parseFloat(data.price) || 0,
                image: data.image,
                category: data.category,
                material: data.material,
                inStock: data.inStock,
                featured: data.featured,
            }
        })

        return NextResponse.json(charm)
    } catch (error) {
        console.error('Error updating charm:', error)
        return NextResponse.json({ error: 'Failed to update charm' }, { status: 500 })
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
        await prisma.charm.delete({ where: { id } })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting charm:', error)
        return NextResponse.json({ error: 'Failed to delete charm' }, { status: 500 })
    }
}
