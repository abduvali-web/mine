import { prisma } from '@/lib/prisma'
import { Link } from '@/navigation'
import { notFound } from 'next/navigation'
import Header from '@/components/store/Header'
import Footer from '@/components/store/Footer'
import AddToCartButton from '@/components/store/AddToCartButton'
import ProductGallery from '@/components/store/ProductGallery'
import styles from './product.module.css'

export default async function ProductPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
    const { locale, slug } = await params
    const product = await prisma.product.findUnique({
        where: { slug },
        include: { category: true }
    })

    if (!product) {
        notFound()
    }

    const images = JSON.parse(product.images || '[]') as string[]
    const categories = await prisma.category.findMany({ orderBy: { order: 'asc' } })

    return (
        <>
            <Header categories={categories} />
            <div className={styles.main}>
                <div className={styles.container}>
                    {/* Breadcrumbs */}
                    <nav className={styles.breadcrumb}>
                        <Link href="/">Home</Link> /
                        <Link href={`/shop/${product.category.slug}`}> {product.category.name}</Link> /
                        <span> {product.name}</span>
                    </nav>

                    <div className={styles.product}>
                        {/* Gallery Component */}
                        <ProductGallery images={images} />

                        {/* Product Info */}
                        <div className={styles.info}>
                            <span className={styles.category}>{product.category.name}</span>
                            <h1 className={styles.name}>{product.name}</h1>

                            <div className={styles.prices}>
                                <span className={styles.price}>£{product.price.toFixed(2)}</span>
                            </div>

                            <div className={styles.description}>
                                {product.description}
                            </div>

                            <AddToCartButton
                                product={product}
                                enablePersonalization={product.category.slug === 'personalised-jewellery'}
                            />

                            <div className={styles.details}>
                                <h3>Product Details</h3>
                                <ul>
                                    <li>18K Gold Plated Stainless Steel</li>
                                    <li>Water Resistant & Tarnish Free</li>
                                    <li>Hypoallergenic & Nickel Free</li>
                                    <li>2 Year Warranty Included</li>
                                    <li>Luxury Gift Packaging</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export async function generateStaticParams() {
    const locales = ['en', 'ru', 'uz'];
    const products = await prisma.product.findMany()

    const params = [];
    for (const locale of locales) {
        for (const product of products) {
            params.push({ locale, slug: product.slug });
        }
    }
    return params;
}
