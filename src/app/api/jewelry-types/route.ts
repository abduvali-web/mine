import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
    try {
        const types = await prisma.jewelryType.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { jewelryItems: true }
                }
            }
        })
        return NextResponse.json(types)
    } catch (error) {
        console.error('Error fetching jewelry types:', error)
        return NextResponse.json({ error: 'Failed to fetch jewelry types' }, { status: 500 })
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

        const type = await prisma.jewelryType.create({
            data: {
                name: data.name,
                slug,
                description: data.description || '',
                image: data.image || null,
                supportsCharms: data.supportsCharms ?? true,
                maxCharmSlots: data.maxCharmSlots ?? 12,
            }
        })

        return NextResponse.json(type)
    } catch (error) {
        console.error('Error creating jewelry type:', error)
        return NextResponse.json({ error: 'Failed to create jewelry type' }, { status: 500 })
    }
}
