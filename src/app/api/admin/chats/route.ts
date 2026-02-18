import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const chats = await prisma.chat.findMany({
            orderBy: { updatedAt: 'desc' },
            include: {
                owner: {
                    select: { name: true, email: true }
                },
                _count: {
                    select: { members: true, messages: true }
                }
            }
        })
        return NextResponse.json(chats)
    } catch (error) {
        console.error('Error fetching admin chats:', error)
        return NextResponse.json({ error: 'Failed to fetch chats' }, { status: 500 })
    }
}
