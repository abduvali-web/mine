import { prisma } from '@/lib/prisma'
import { Link } from '@/navigation'
import Header from '@/components/store/Header'
import Footer from '@/components/store/Footer'
import ProductCard from '@/components/store/ProductCard'
import styles from '../shop.module.css'

export default async function CategoryPage({ params }: { params: Promise<{ locale: string; category: string }> }) {
    const { locale, category: slug } = await params

    const category = await prisma.category.findUnique({
        where: { slug },
        include: { products: true }
    })

    if (!category) {
        return <div>Category not found</div>
    }

    const categories = await prisma.category.findMany({ orderBy: { order: 'asc' } })

    return (
        <>
            <Header categories={categories} />
            <main className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>{category.name.toUpperCase()}</h1>
                    <p className={styles.count}>{category.products.length} Products</p>
                </div>

                <div className={styles.grid}>
                    {category.products.map(product => (
                        <ProductCard
                            key={product.id}
                            {...product}
                            category={category}
                        />
                    ))}
                </div>
            </main>
            <Footer />
        </>
    )
}

export async function generateStaticParams() {
    try {
        const locales = ['en', 'ru', 'uz'];
        const categories = await prisma.category.findMany()

        const params = [];
        for (const locale of locales) {
            for (const category of categories) {
                params.push({ locale, category: category.slug });
            }
        }
        return params;
    } catch (e) {
        console.error('Error generating static params:', e);
        return [];
    }
}
