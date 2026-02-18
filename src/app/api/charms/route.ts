import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
    try {
        const charms = await prisma.charm.findMany({
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json(charms)
    } catch (error) {
        console.error('Error fetching charms:', error)
        return NextResponse.json({ error: 'Failed to fetch charms' }, { status: 500 })
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

        const charm = await prisma.charm.create({
            data: {
                name: data.name,
                slug,
                description: data.description || '',
                price: parseFloat(data.price) || 0,
                image: data.image || '',
                category: data.category || null,
                material: data.material || 'gold',
                inStock: data.inStock ?? true,
                featured: data.featured ?? false,
            }
        })

        return NextResponse.json(charm)
    } catch (error) {
        console.error('Error creating charm:', error)
        return NextResponse.json({ error: 'Failed to create charm' }, { status: 500 })
    }
}
