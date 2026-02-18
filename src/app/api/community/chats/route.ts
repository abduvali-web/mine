import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Get user's chats
export async function GET(req: NextRequest) {
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

        // Get all chats where user is a member
        const memberships = await prisma.chatMember.findMany({
            where: { userId: user.id },
            include: {
                chat: {
                    include: {
                        members: {
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        name: true,
                                        username: true,
                                        email: true,
                                        avatar: true
                                    }
                                }
                            },
                        },
                        messages: {
                            orderBy: { createdAt: 'desc' },
                            take: 1,
                            include: {
                                sender: {
                                    select: {
                                        id: true,
                                        name: true,
                                        username: true,
                                        email: true
                                    }
                                }
                            }
                        },
                        _count: {
                            select: { members: true }
                        }
                    }
                }
            },
            orderBy: {
                chat: { updatedAt: 'desc' }
            }
        })

        const chats = memberships.map(m => {
            const lastMessage = m.chat.messages[0]
            return {
                ...m.chat,
                lastMessage,
                unreadCount: lastMessage && new Date(lastMessage.createdAt) > new Date(m.lastReadAt) ? 1 : 0,
                myRole: m.role,
                isMuted: m.isMuted
            }
        })

        return NextResponse.json(chats)
    } catch (error) {
        console.error('Error fetching chats:', error)
        return NextResponse.json({ error: 'Failed to fetch chats' }, { status: 500 })
    }
}

// Create chat
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

        if (data.type === 'direct') {
            // Check existing direct chat
            const existingChat = await prisma.chat.findFirst({
                where: {
                    type: 'direct',
                    AND: [
                        { members: { some: { userId: user.id } } },
                        { members: { some: { userId: data.recipientId } } }
                    ]
                },
                include: {
                    members: { include: { user: { select: { id: true, name: true, username: true, email: true, avatar: true } } } }
                }
            })

            if (existingChat) return NextResponse.json(existingChat)

            // Create new
            const chat = await prisma.chat.create({
                data: {
                    type: 'direct',
                    members: {
                        create: [
                            { userId: user.id, role: 'member' },
                            { userId: data.recipientId, role: 'member' }
                        ]
                    }
                },
                include: {
                    members: { include: { user: { select: { id: true, name: true, username: true, email: true, avatar: true } } } }
                }
            })
            return NextResponse.json(chat)

        } else if (data.type === 'group') {
            const chat = await prisma.chat.create({
                data: {
                    type: 'group',
                    name: data.name,
                    description: data.description,
                    isPublic: data.isPublic ?? false,
                    ownerId: user.id,
                    members: {
                        create: { userId: user.id, role: 'owner' }
                    }
                }
            })
            return NextResponse.json(chat)
        }

        return NextResponse.json({ error: 'Invalid type' }, { status: 400 })

    } catch (error) {
        console.error('Error creating chat:', error)
        return NextResponse.json({ error: 'Failed to create chat' }, { status: 500 })
    }
}
