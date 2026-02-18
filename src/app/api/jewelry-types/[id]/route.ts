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
        const type = await prisma.jewelryType.findUnique({
            where: { id },
            include: {
                jewelryItems: true
            }
        })

        if (!type) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 })
        }

        return NextResponse.json(type)
    } catch (error) {
        console.error('Error fetching jewelry type:', error)
        return NextResponse.json({ error: 'Failed to fetch jewelry type' }, { status: 500 })
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

        const type = await prisma.jewelryType.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
                image: data.image,
                supportsCharms: data.supportsCharms,
                maxCharmSlots: data.maxCharmSlots,
            }
        })

        return NextResponse.json(type)
    } catch (error) {
        console.error('Error updating jewelry type:', error)
        return NextResponse.json({ error: 'Failed to update jewelry type' }, { status: 500 })
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
        await prisma.jewelryType.delete({ where: { id } })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting jewelry type:', error)
        return NextResponse.json({ error: 'Failed to delete jewelry type' }, { status: 500 })
    }
}
