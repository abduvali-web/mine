
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const count = await prisma.product.count()
    console.log('Total products:', count)

    const products = await prisma.product.findMany({
        include: { category: true },
        take: 5
    })

    console.log('Sample products:')
    products.forEach(p => console.log(`- ${p.name} (${p.category?.name})`))
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
