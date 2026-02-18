import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
    try {
        const items = await prisma.jewelryItem.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                type: true
            }
        })
        return NextResponse.json(items)
    } catch (error) {
        console.error('Error fetching jewelry items:', error)
        return NextResponse.json({ error: 'Failed to fetch jewelry items' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const data = await req.json()

        const slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

        const item = await prisma.jewelryItem.create({
            data: {
                name: data.name,
                slug,
                description: data.description || '',
                price: parseFloat(data.price) || 0,
                compareAt: data.compareAt ? parseFloat(data.compareAt) : null,
                image: data.image || '',
                material: data.material || 'gold',
                length: data.length || null,
                typeId: data.typeId,
                supportsCharms: data.supportsCharms ?? true,
                charmPositions: data.charmPositions || '[]',
                inStock: data.inStock ?? true,
                featured: data.featured ?? false,
            }
        })

        return NextResponse.json(item)
    } catch (error) {
        console.error('Error creating jewelry item:', error)
        return NextResponse.json({ error: 'Failed to create jewelry item' }, { status: 500 })
    }
}
