import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
    const settings = await prisma.settings.findUnique({
        where: { id: 'main' }
    })
    return NextResponse.json(settings || {})
}

export async function POST(req: Request) {
    const body = await req.json()

    // Ensure numeric values are floats
    const data = {
        ...body,
        shippingFee: parseFloat(body.shippingFee),
        freeShipMin: parseFloat(body.freeShipMin)
    }

    const settings = await prisma.settings.upsert({
        where: { id: 'main' },
        update: data,
        create: { id: 'main', ...data }
    })

    return NextResponse.json(settings)
}
