import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const code = searchParams.get('code')
        const showPublic = searchParams.get('public') === 'true'

        // 1. Fetch by Share Code (Public access allowed)
        if (code) {
            const design = await prisma.customDesign.findUnique({
                where: { shareCode: code },
                include: {
                    user: { select: { name: true, email: true } },
                    jewelryItem: true
                }
            })
            if (!design) return NextResponse.json({ error: 'Design not found' }, { status: 404 })
            return NextResponse.json(design)
        }

        // 2. Fetch Public Designs
        if (showPublic) {
            const designs = await prisma.customDesign.findMany({
                where: { isPublic: true },
                orderBy: { createdAt: 'desc' },
                include: {
                    user: { select: { name: true } },
                    jewelryItem: { select: { name: true, image: true } }
                }
            })
            return NextResponse.json(designs)
        }

        // 3. Fetch My Designs (Auth required)
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({ where: { email: session.user.email } })
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

        const designs = await prisma.customDesign.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
            include: {
                jewelryItem: { select: { name: true, image: true } }
            }
        })
        return NextResponse.json(designs)

    } catch (error) {
        console.error('Error fetching designs:', error)
        return NextResponse.json({ error: 'Failed to fetch designs' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const data = await req.json()

        // Generate a unique share code (e.g., 8 chars alphanumeric)
        const shareCode = Math.random().toString(36).substring(2, 10).toUpperCase()

        const design = await prisma.customDesign.create({
            data: {
                userId: user.id,
                jewelryItemId: data.jewelryItemId,
                charmPlacements: JSON.stringify(data.charmPlacements),
                name: data.name || 'My Custom Design',
                tags: JSON.stringify(data.tags || []),
                totalPrice: data.totalPrice,
                shareCode,
                isPublic: data.isPublic || false
            }
        })

        return NextResponse.json(design)

    } catch (error) {
        console.error('Error creating design:', error)
        return NextResponse.json({ error: 'Failed to create design' }, { status: 500 })
    }
}
