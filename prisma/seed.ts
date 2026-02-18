import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting seed...')

    // =============================================
    // SETTINGS
    // =============================================
    await prisma.settings.upsert({
        where: { id: 'main' },
        update: {},
        create: {
            id: 'main',
            storeName: 'SUN KISSED YOU',
            storeEmail: 'contact@sunkissed.com',
            currency: '£',
            shippingFee: 5.0,
            freeShipMin: 100.0,
            heroTitle: 'SUN KISSED YOU',
            heroSubtitle: '18K Gold Plated Jewellery · High Quality & Affordable',
            footerText: '© 2024 SUN KISSED YOU. All rights reserved.',
            referralPercent: 5.0,
        }
    })
    console.log('✅ Settings created')

    // =============================================
    // ADMIN USER
    // =============================================
    const hashedPassword = await bcrypt.hash('admin123', 12)
    await prisma.admin.upsert({
        where: { email: 'admin@sunkissed.com' },
        update: {},
        create: {
            email: 'admin@sunkissed.com',
            password: hashedPassword,
            name: 'Admin'
        }
    })
    console.log('✅ Admin created (admin@sunkissed.com / admin123)')

    // =============================================
    // DEMO USER
    // =============================================
    const userPassword = await bcrypt.hash('user123', 12)
    const demoUser = await prisma.user.upsert({
        where: { email: 'demo@example.com' },
        update: {},
        create: {
            email: 'demo@example.com',
            password: userPassword,
            name: 'Demo User',
            username: 'demouser',
            bio: 'I love creating beautiful jewelry designs! 💎',
            coinBalance: 25.50
        }
    })
    console.log('✅ Demo user created (demo@example.com / user123)')

    // =============================================
    // CATEGORIES
    // =============================================
    const categories = await Promise.all([
        prisma.category.upsert({
            where: { slug: 'necklaces' },
            update: {},
            create: { name: 'Necklaces', slug: 'necklaces', order: 1 }
        }),
        prisma.category.upsert({
            where: { slug: 'bracelets' },
            update: {},
            create: { name: 'Bracelets', slug: 'bracelets', order: 2 }
        }),
        prisma.category.upsert({
            where: { slug: 'rings' },
            update: {},
            create: { name: 'Rings', slug: 'rings', order: 3 }
        }),
        prisma.category.upsert({
            where: { slug: 'earrings' },
            update: {},
            create: { name: 'Earrings', slug: 'earrings', order: 4 }
        }),
        prisma.category.upsert({
            where: { slug: 'charms' },
            update: {},
            create: { name: 'Charms', slug: 'charms', order: 5 }
        }),
        prisma.category.upsert({
            where: { slug: 'personalised-jewellery' },
            update: {},
            create: { name: 'Personalised Jewellery', slug: 'personalised-jewellery', order: 6 }
        }),
        prisma.category.upsert({
            where: { slug: 'new-arrivals' },
            update: {},
            create: { name: 'New Arrivals', slug: 'new-arrivals', order: 7 }
        }),
    ])
    console.log('✅ Categories created')

    // =============================================
    // JEWELRY TYPES
    // =============================================
    const necklaceType = await prisma.jewelryType.upsert({
        where: { slug: 'necklaces' },
        update: {},
        create: {
            name: 'Necklaces',
            slug: 'necklaces',
            description: 'Beautiful chains for your custom creations',
            supportsCharms: true,
            maxCharmSlots: 12,
        }
    })

    const braceletType = await prisma.jewelryType.upsert({
        where: { slug: 'bracelets' },
        update: {},
        create: {
            name: 'Bracelets',
            slug: 'bracelets',
            description: 'Elegant bracelets with charm support',
            supportsCharms: true,
            maxCharmSlots: 6,
        }
    })

    const ringType = await prisma.jewelryType.upsert({
        where: { slug: 'rings' },
        update: {},
        create: {
            name: 'Rings',
            slug: 'rings',
            description: 'Premium rings with optional engravings',
            supportsCharms: false,
            maxCharmSlots: 0,
        }
    })

    const earringType = await prisma.jewelryType.upsert({
        where: { slug: 'earrings' },
        update: {},
        create: {
            name: 'Earrings',
            slug: 'earrings',
            description: 'Beautiful earrings with charm drops',
            supportsCharms: true,
            maxCharmSlots: 2,
        }
    })
    console.log('✅ Jewelry types created')

    // =============================================
    // JEWELRY ITEMS (Chains, Bracelets, etc.)
    // =============================================

    // Define charm positions for a necklace (6 front, 6 back)
    const necklacePositions = JSON.stringify([
        // Front positions (visible side)
        { id: 1, x: 15, y: 65, side: 'front', label: 'Left 1' },
        { id: 2, x: 25, y: 75, side: 'front', label: 'Left 2' },
        { id: 3, x: 38, y: 85, side: 'front', label: 'Left 3' },
        { id: 4, x: 62, y: 85, side: 'front', label: 'Right 3' },
        { id: 5, x: 75, y: 75, side: 'front', label: 'Right 2' },
        { id: 6, x: 85, y: 65, side: 'front', label: 'Right 1' },
        // Back positions
        { id: 7, x: 15, y: 65, side: 'back', label: 'Back Left 1' },
        { id: 8, x: 25, y: 75, side: 'back', label: 'Back Left 2' },
        { id: 9, x: 38, y: 85, side: 'back', label: 'Back Left 3' },
        { id: 10, x: 62, y: 85, side: 'back', label: 'Back Right 3' },
        { id: 11, x: 75, y: 75, side: 'back', label: 'Back Right 2' },
        { id: 12, x: 85, y: 65, side: 'back', label: 'Back Right 1' },
    ])

    const braceletPositions = JSON.stringify([
        { id: 1, x: 10, y: 50, side: 'front', label: 'Slot 1' },
        { id: 2, x: 30, y: 50, side: 'front', label: 'Slot 2' },
        { id: 3, x: 50, y: 50, side: 'front', label: 'Slot 3' },
        { id: 4, x: 70, y: 50, side: 'front', label: 'Slot 4' },
        { id: 5, x: 90, y: 50, side: 'front', label: 'Slot 5' },
        { id: 6, x: 50, y: 50, side: 'back', label: 'Back Center' },
    ])

    await prisma.jewelryItem.upsert({
        where: { slug: 'gold-rope-chain-18in' },
        update: {},
        create: {
            name: 'Gold Rope Chain 18"',
            slug: 'gold-rope-chain-18in',
            description: 'Elegant 18K gold plated rope chain, perfect for layering with charms',
            price: 45.00,
            compareAt: 65.00,
            image: '/jewelry-assets/chain-rope-gold.svg',
            material: 'gold',
            length: '18in',
            typeId: necklaceType.id,
            supportsCharms: true,
            charmPositions: necklacePositions,
            featured: true,
        }
    })

    await prisma.jewelryItem.upsert({
        where: { slug: 'silver-cable-chain-16in' },
        update: {},
        create: {
            name: 'Silver Cable Chain 16"',
            slug: 'silver-cable-chain-16in',
            description: 'Classic sterling silver cable chain with subtle elegance',
            price: 35.00,
            compareAt: 50.00,
            image: '/jewelry-assets/chain-cable-silver.svg',
            material: 'silver',
            length: '16in',
            typeId: necklaceType.id,
            supportsCharms: true,
            charmPositions: necklacePositions,
            featured: true,
        }
    })

    await prisma.jewelryItem.upsert({
        where: { slug: 'gold-rope-chain-20in' },
        update: {},
        create: {
            name: 'Gold Rope Chain 20"',
            slug: 'gold-rope-chain-20in',
            description: 'Longer 18K gold plated rope chain for statement pieces',
            price: 55.00,
            image: '/jewelry-assets/chain-rope-gold.svg',
            material: 'gold',
            length: '20in',
            typeId: necklaceType.id,
            supportsCharms: true,
            charmPositions: necklacePositions,
        }
    })
    console.log('✅ Jewelry items created')

    // =============================================
    // CHARMS
    // =============================================
    await prisma.charm.upsert({
        where: { slug: 'heart-gold' },
        update: {},
        create: {
            name: 'Golden Heart',
            slug: 'heart-gold',
            description: 'A delicate heart charm symbolizing love and affection',
            price: 12.00,
            image: '/jewelry-assets/charm-heart-gold.svg',
            category: 'symbols',
            material: 'gold',
            featured: true,
        }
    })

    await prisma.charm.upsert({
        where: { slug: 'star-gold' },
        update: {},
        create: {
            name: 'Celestial Star',
            slug: 'star-gold',
            description: 'A sparkling star charm for those who shine bright',
            price: 10.00,
            image: '/jewelry-assets/charm-star-gold.svg',
            category: 'celestial',
            material: 'gold',
            featured: true,
        }
    })

    await prisma.charm.upsert({
        where: { slug: 'moon-gold' },
        update: {},
        create: {
            name: 'Crescent Moon',
            slug: 'moon-gold',
            description: 'A beautiful crescent moon for dreamers',
            price: 14.00,
            image: '/jewelry-assets/charm-moon-gold.svg',
            category: 'celestial',
            material: 'gold',
            featured: true,
        }
    })

    await prisma.charm.upsert({
        where: { slug: 'butterfly-gold' },
        update: {},
        create: {
            name: 'Golden Butterfly',
            slug: 'butterfly-gold',
            description: 'A graceful butterfly symbolizing transformation',
            price: 15.00,
            image: '/jewelry-assets/charm-butterfly-gold.svg',
            category: 'nature',
            material: 'gold',
            featured: true,
        }
    })
    console.log('✅ Charms created')

    // =============================================
    // SAMPLE PRODUCTS (for shop)
    // =============================================
    const necklaceCategory = categories.find(c => c.slug === 'necklaces')
    if (necklaceCategory) {
        await prisma.product.upsert({
            where: { slug: 'layered-gold-necklace' },
            update: {},
            create: {
                name: 'Layered Gold Necklace',
                slug: 'layered-gold-necklace',
                description: 'Beautiful layered necklace with multiple chains',
                price: 89.00,
                compareAt: 120.00,
                images: JSON.stringify(['/jewelry-assets/chain-rope-gold.svg']),
                categoryId: necklaceCategory.id,
                featured: true,
            }
        })
    }
    console.log('✅ Products created')

    // =============================================
    // SAMPLE CUSTOM DESIGN
    // =============================================
    const sampleChain = await prisma.jewelryItem.findFirst({ where: { slug: 'gold-rope-chain-18in' } })
    const heartCharm = await prisma.charm.findFirst({ where: { slug: 'heart-gold' } })
    const starCharm = await prisma.charm.findFirst({ where: { slug: 'star-gold' } })
    const moonCharm = await prisma.charm.findFirst({ where: { slug: 'moon-gold' } })

    if (sampleChain && heartCharm && starCharm && moonCharm) {
        await prisma.customDesign.upsert({
            where: { shareCode: 'DEMO2024' },
            update: {},
            create: {
                userId: demoUser.id,
                jewelryItemId: sampleChain.id,
                charmPlacements: JSON.stringify([
                    { positionId: 2, charmId: heartCharm.id },
                    { positionId: 3, charmId: starCharm.id },
                    { positionId: 4, charmId: moonCharm.id },
                    { positionId: 5, charmId: heartCharm.id },
                ]),
                name: 'Celestial Love',
                tags: JSON.stringify(['celestial', 'romantic', 'gold', 'featured']),
                description: 'A beautiful combination of hearts, stars, and moons',
                shareCode: 'DEMO2024',
                isPublic: true,
                totalPrice: sampleChain.price + heartCharm.price * 2 + starCharm.price + moonCharm.price,
                views: 156,
                likes: 42,
                purchases: 8,
            }
        })
        console.log('✅ Sample custom design created (share code: DEMO2024)')
    }

    // =============================================
    // SAMPLE CHAT/GROUP
    // =============================================
    const demoChat = await prisma.chat.upsert({
        where: { username: 'jewelrylovers' },
        update: {},
        create: {
            type: 'group',
            name: 'Jewelry Lovers Community',
            username: 'jewelrylovers',
            description: 'Share your designs and get inspired by others! 💎✨',
            ownerId: demoUser.id,
            isPublic: true,
        }
    })

    // Add demo user as owner
    await prisma.chatMember.upsert({
        where: { chatId_userId: { chatId: demoChat.id, userId: demoUser.id } },
        update: {},
        create: {
            chatId: demoChat.id,
            userId: demoUser.id,
            role: 'owner',
        }
    })

    // Add a welcome message
    await prisma.message.create({
        data: {
            chatId: demoChat.id,
            senderId: demoUser.id,
            content: 'Welcome to the Jewelry Lovers Community! 💎 Share your custom designs and get inspired by others. Don\'t forget to tag your creations so everyone can find them!',
            type: 'text',
        }
    })
    console.log('✅ Sample community chat created (@jewelrylovers)')

    // =============================================
    // PAGES
    // =============================================
    await prisma.page.upsert({
        where: { slug: 'contact' },
        update: {},
        create: {
            title: 'Contact Us',
            slug: 'contact',
            content: '<p>Get in touch with us at contact@sunkissed.com or call +44 123 456 7890.</p>',
            published: true
        }
    })
    console.log('✅ Pages created')

    console.log('🎉 Seed completed successfully!')
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
