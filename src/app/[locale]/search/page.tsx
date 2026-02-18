import { prisma } from '@/lib/prisma'
import Header from '@/components/store/Header'
import Footer from '@/components/store/Footer'
import ProductCard from '@/components/store/ProductCard'
import SearchInput from './SearchInput'
import styles from './search.module.css'

export const metadata = {
    title: 'Search | Sun Kissed You',
    description: 'Search our collection of premium jewellery.',
}

export default async function SearchPage({
    searchParams
}: {
    searchParams: Promise<{ q?: string }>
}) {
    const { q } = await searchParams
    const query = q || ''

    const categories = await prisma.category.findMany({ orderBy: { order: 'asc' } })

    const products = query
        ? await prisma.product.findMany({
            where: {
                OR: [
                    { name: { contains: query } },
                    { description: { contains: query } },
                    { category: { name: { contains: query } } }
                ]
            },
            include: { category: true }
        })
        : []

    return (
        <div className={styles.main}>
            <Header categories={categories} />

            <div className={styles.container}>
                <div className={styles.searchHeader}>
                    <h1 className={styles.title}>Search Collection</h1>
                    <SearchInput />
                    {query && (
                        <p className={styles.resultsInfo}>
                            Found {products.length} result{products.length !== 1 ? 's' : ''} for "{query}"
                        </p>
                    )}
                </div>

                {query ? (
                    products.length > 0 ? (
                        <div className={styles.grid}>
                            {products.map(product => (
                                <ProductCard
                                    key={product.id}
                                    {...product}
                                    category={product.category}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className={styles.empty}>
                            <span className={styles.emptyIcon}>🔍</span>
                            <h2>No matches found</h2>
                            <p>Try checking your spelling or using different keywords.</p>
                        </div>
                    )
                ) : (
                    <div className={styles.empty}>
                        <p>Start typing to search...</p>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    )
}
