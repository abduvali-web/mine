
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding Personalised Jewellery...')

    // Create Category
    const category = await prisma.category.upsert({
        where: { slug: 'personalised-jewellery' },
        update: {},
        create: {
            name: 'Personalised Jewellery',
            slug: 'personalised-jewellery',
            order: 6
        }
    })
    console.log('✅ Created category:', category.name)

    // Create Products
    const products = [
        {
            name: 'Custom Name Necklace',
            slug: 'custom-name-necklace',
            description: 'Your name, your style. 18K Gold Plated custom name necklace available in multiple fonts. Water resistant and perfect for everyday wear.',
            price: 49.99,
            categoryId: category.id,
            featured: true,
            images: JSON.stringify(['/placeholder.jpg'])
        },
        {
            name: 'Engravable Bar Bracelet',
            slug: 'engravable-bar-bracelet',
            description: 'A sleek bar bracelet ready for your meaningful date, name, or initials. 18K Gold Plated on Stainless Steel.',
            price: 39.99,
            categoryId: category.id,
            featured: true,
            images: JSON.stringify(['/placeholder.jpg'])
        },
        {
            name: 'Initial Signet Ring',
            slug: 'initial-signet-ring',
            description: 'Classic signet ring engraved with your initial. timeless and elegant.',
            price: 34.99,
            categoryId: category.id,
            featured: true,
            images: JSON.stringify(['/placeholder.jpg'])
        }
    ]

    for (const product of products) {
        await prisma.product.upsert({
            where: { slug: product.slug },
            update: {},
            create: product
        })
    }
    console.log('✅ Created personalised products')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
