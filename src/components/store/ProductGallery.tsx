'use client'

import { useState } from 'react'
import styles from './ProductGallery.module.css'

interface ProductGalleryProps {
    images: string[]
}

export default function ProductGallery({ images }: ProductGalleryProps) {
    const [selected, setSelected] = useState(0)
    const displayImages = images.length > 0 ? images : ['/placeholder.jpg']

    return (
        <div className={styles.gallery}>
            <div className={styles.mainImage}>
                <div
                    className={styles.image}
                    style={{ backgroundImage: `url(${displayImages[selected]})` }}
                />
            </div>
            {displayImages.length > 1 && (
                <div className={styles.thumbs}>
                    {displayImages.map((img, idx) => (
                        <button
                            key={idx}
                            className={`${styles.thumbWrapper} ${selected === idx ? styles.active : ''}`}
                            onClick={() => setSelected(idx)}
                            aria-label={`View image ${idx + 1}`}
                        >
                            <div
                                className={styles.thumb}
                                style={{ backgroundImage: `url(${img})` }}
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
