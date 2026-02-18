import { prisma } from '@/lib/prisma'
import ProductEditor from './ProductEditor'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const isNew = id === 'new'
    let product = null

    if (!isNew) {
        product = await prisma.product.findUnique({ where: { id } })
    }

    const categories = await prisma.category.findMany({ orderBy: { order: 'asc' } })

    return <ProductEditor product={product} categories={categories} />
}
