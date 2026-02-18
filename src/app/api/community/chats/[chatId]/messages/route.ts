import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ chatId: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { chatId } = await params
        const { searchParams } = new URL(req.url)
        const limit = parseInt(searchParams.get('limit') || '50')

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Verify membership
        const member = await prisma.chatMember.findUnique({
            where: { chatId_userId: { chatId, userId: user.id } }
        })

        if (!member) {
            return NextResponse.json({ error: 'Not a member' }, { status: 403 })
        }

        // Update read status
        await prisma.chatMember.update({
            where: { id: member.id },
            data: { lastReadAt: new Date() }
        })

        const messages = await prisma.message.findMany({
            where: { chatId, isDeleted: false },
            orderBy: { createdAt: 'desc' },
            take: limit,
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        email: true,
                        avatar: true
                    }
                }
            }
        })

        return NextResponse.json({ messages: messages.reverse() })

    } catch (error) {
        console.error('Error fetching messages:', error)
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
    }
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ chatId: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { chatId } = await params
        const data = await req.json()

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Verify membership
        const member = await prisma.chatMember.findUnique({
            where: { chatId_userId: { chatId, userId: user.id } }
        })

        if (!member) {
            return NextResponse.json({ error: 'Not a member' }, { status: 403 })
        }

        const message = await prisma.message.create({
            data: {
                chatId,
                senderId: user.id,
                content: data.content,
                type: data.type || 'text',
                designId: data.designId
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        email: true,
                        avatar: true
                    }
                }
            }
        })

        // Update chat timestamp
        await prisma.chat.update({
            where: { id: chatId },
            data: { updatedAt: new Date() }
        })

        // Also update sender's last read
        await prisma.chatMember.update({
            where: { id: member.id },
            data: { lastReadAt: new Date() }
        })

        return NextResponse.json(message)

    } catch (error) {
        console.error('Error sending message:', error)
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
    }
}
