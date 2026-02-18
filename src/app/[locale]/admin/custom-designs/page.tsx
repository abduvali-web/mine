'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import styles from '../jewelry-builder.module.css'

interface CustomDesign {
    id: string
    shareCode: string
    createdAt: string
    totalPrice: number
    isPublic: boolean
    views: number
    likes: number
    purchases: number
    user: {
        name: string | null
        email: string
    }
    jewelryItem: {
        name: string
        image: string
    }
    charmPlacements: string
    tags: string
}

export default function CustomDesignsPage() {
    const [designs, setDesigns] = useState<CustomDesign[]>([])
    const [loading, setLoading] = useState(true)

    const fetchDesigns = useCallback(async () => {
        try {
            const res = await fetch('/api/custom-designs')
            const data = await res.json()
            setDesigns(data)
        } catch (error) {
            console.error('Error fetching designs:', error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchDesigns()
    }, [fetchDesigns])

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner} />
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Custom Designs</h1>
                    <p className={styles.subtitle}>View designs created by users</p>
                </div>
            </div>

            {designs.length === 0 ? (
                <div className={styles.empty}>
                    <div className={styles.emptyIcon}>🎨</div>
                    <h3 className={styles.emptyTitle}>No Designs Yet</h3>
                    <p className={styles.emptyText}>User designs will appear here.</p>
                </div>
            ) : (
                <div className={styles.grid}>
                    {designs.map(design => (
                        <div key={design.id} className={styles.card}>
                            <div className={styles.cardContent}>
                                <div style={{ marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <Image
                                        src={design.jewelryItem.image || '/placeholder.png'}
                                        alt={design.jewelryItem.name}
                                        width={60}
                                        height={60}
                                        style={{ borderRadius: '8px', objectFit: 'cover' }}
                                    />
                                    <div>
                                        <h3 className={styles.cardName} style={{ margin: 0, fontSize: '1rem' }}>{design.jewelryItem.name}</h3>
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#888' }}>
                                            by {design.user.name || 'Anonymous'}
                                        </p>
                                    </div>
                                </div>

                                <div className={styles.cardMeta}>
                                    <span className={styles.badge} style={{ background: '#f0f0f0', color: '#666' }}>
                                        {design.views} Views
                                    </span>
                                    <span className={styles.badge} style={{ background: '#f0f0f0', color: '#666' }}>
                                        {design.likes} Likes
                                    </span>
                                    <span className={styles.badge} style={{ background: '#e6fffa', color: '#047857' }}>
                                        {design.purchases} Sales
                                    </span>
                                </div>

                                <div className={styles.price}>
                                    £{design.totalPrice.toFixed(2)}
                                </div>

                                <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '16px' }}>
                                    <strong>Code:</strong> {design.shareCode}
                                </div>

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '16px' }}>
                                    {(() => {
                                        try {
                                            const tags = JSON.parse(design.tags) as string[]
                                            return tags.map(tag => (
                                                <span key={tag} style={{ fontSize: '0.7rem', padding: '2px 8px', background: '#f5f5f5', borderRadius: '4px', color: '#888' }}>
                                                    #{tag}
                                                </span>
                                            ))
                                        } catch { return null }
                                    })()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
