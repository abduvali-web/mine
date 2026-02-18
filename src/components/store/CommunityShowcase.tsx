'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import styles from './Community.module.css'

interface Design {
    id: string
    name: string | null
    shareCode: string
    charmPlacements: string
    jewelryItem: {
        name: string
        image: string
    }
    user: {
        name: string | null
    }
}

export default function CommunityShowcase() {
    const [designs, setDesigns] = useState<Design[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        fetch('/api/custom-designs?public=true')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setDesigns(data)
                }
            })
            .catch(err => console.error('Error loading community designs:', err))
            .finally(() => setLoading(false))
    }, [])

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Loading impressive designs...</div>
    }

    return (
        <div className={styles.showcaseContainer}>
            <div className={styles.showcaseGrid}>
                {designs.length === 0 ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#666' }}>
                        No community designs shared yet. Be the first to share one from the Builder!
                    </div>
                ) : (
                    designs.map(design => (
                        <div key={design.id} className={styles.designCard}>
                            <div className={styles.designImage}>
                                <Image
                                    src={design.jewelryItem.image}
                                    alt={design.name || 'Custom Design'}
                                    width={200}
                                    height={200}
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                />
                                {/* Note: Ideally we would layer charms here too, but for list view base image is okay 
                                    or we need a generated preview image stored in DB. 
                                    For now, showing base chain is a simplified display. */}
                            </div>
                            <div className={styles.designInfo}>
                                <h3 className={styles.designName}>{design.name || 'Untitled Creation'}</h3>
                                <p className={styles.designAuthor}>by {design.user.name || 'Anonymous'}</p>
                                <button
                                    className={styles.openBtn}
                                    onClick={() => router.push(`/build-your-own?design=${design.shareCode}`)}
                                >
                                    Open in Builder
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
