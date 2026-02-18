import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const query = searchParams.get('q') || ''

        if (query.length < 2) {
            return NextResponse.json({ users: [], groups: [] })
        }

        const searchTerm = query.replace(/^@/, '')

        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { username: { contains: searchTerm, mode: 'insensitive' } },
                    { name: { contains: searchTerm, mode: 'insensitive' } }
                ],
                NOT: { email: session.user.email } // exclude self
            },
            select: {
                id: true,
                name: true,
                username: true,
                avatar: true
            },
            take: 5
        })

        const groups = await prisma.chat.findMany({
            where: {
                type: 'group',
                isPublic: true,
                OR: [
                    { name: { contains: searchTerm, mode: 'insensitive' } },
                    { username: { contains: searchTerm, mode: 'insensitive' } }
                ]
            },
            take: 5
        })

        return NextResponse.json({ users, groups })

    } catch (error) {
        console.error('Search error:', error)
        return NextResponse.json({ error: 'Search failed' }, { status: 500 })
    }
}
