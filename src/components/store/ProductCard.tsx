'use client'

import Link from 'next/link'
import { useState } from 'react'
import styles from './ProductCard.module.css'

interface ProductCardProps {
    id: string
    name: string
    slug: string
    price: number
    compareAt?: number | null
    images: string
    category?: {
        name: string
        slug: string
    }
}

export default function ProductCard({ name, slug, price, compareAt, images, category }: ProductCardProps) {
    const [hovered, setHovered] = useState(false)
    const imageList = JSON.parse(images || '[]') as string[]
    const mainImage = imageList[0] || '/placeholder.jpg'
    const secondImage = imageList[1] || mainImage
    const hasDiscount = compareAt && compareAt > price

    return (
        <Link
            href={`/product/${slug}`}
            className={styles.card}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className={styles.imageWrapper}>
                <div className={styles.imageContainer}>
                    <div
                        className={`${styles.image} ${hovered ? styles.hidden : ''}`}
                        style={{ backgroundImage: `url(${mainImage})` }}
                    />
                    <div
                        className={`${styles.image} ${styles.hoverImage} ${hovered ? styles.visible : ''}`}
                        style={{ backgroundImage: `url(${secondImage})` }}
                    />
                </div>

                {/* Shimmer overlay */}
                <div className={`${styles.shimmer} ${hovered ? styles.shimmerActive : ''}`} />

                {/* Badges */}
                {hasDiscount && (
                    <span className={styles.badge}>SALE</span>
                )}

                {/* Quick View Overlay */}
                <div className={`${styles.overlay} ${hovered ? styles.overlayVisible : ''}`}>
                    <span className={styles.quickView}>QUICK VIEW</span>
                </div>
            </div>

            <div className={styles.info}>
                {category && (
                    <span className={styles.category}>{category.name}</span>
                )}
                <h3 className={styles.name}>{name}</h3>
                <div className={styles.prices}>
                    <span className={styles.price}>{price.toLocaleString()} SOM</span>
                    {hasDiscount && (
                        <span className={styles.compareAt}>{compareAt.toLocaleString()} SOM</span>
                    )}
                </div>
            </div>

            {/* 3D Glow Effect */}
            <div className={`${styles.glow} ${hovered ? styles.glowActive : ''}`} />
        </Link>
    )
}
