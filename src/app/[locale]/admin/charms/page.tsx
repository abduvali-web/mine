'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import styles from '../jewelry-builder.module.css'

interface Charm {
    id: string
    name: string
    slug: string
    description: string | null
    price: number
    image: string
    category: string | null
    material: string
    inStock: boolean
    featured: boolean
}

const CHARM_CATEGORIES = [
    'symbols',
    'celestial',
    'nature',
    'initials',
    'zodiac',
    'hearts',
    'animals',
    'other'
]

export default function CharmsPage() {
    const [charms, setCharms] = useState<Charm[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingCharm, setEditingCharm] = useState<Charm | null>(null)
    const [saving, setSaving] = useState(false)
    const [filterCategory, setFilterCategory] = useState<string>('')

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        image: '',
        category: '',
        material: 'gold',
        inStock: true,
        featured: false,
    })

    const fetchCharms = useCallback(async () => {
        try {
            const res = await fetch('/api/charms')
            const data = await res.json()
            setCharms(data)
        } catch (error) {
            console.error('Error fetching charms:', error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchCharms()
    }, [fetchCharms])

    const openCreateModal = () => {
        setEditingCharm(null)
        setFormData({
            name: '',
            description: '',
            price: '',
            image: '',
            category: '',
            material: 'gold',
            inStock: true,
            featured: false,
        })
        setShowModal(true)
    }

    const openEditModal = (charm: Charm) => {
        setEditingCharm(charm)
        setFormData({
            name: charm.name,
            description: charm.description || '',
            price: charm.price.toString(),
            image: charm.image,
            category: charm.category || '',
            material: charm.material,
            inStock: charm.inStock,
            featured: charm.featured,
        })
        setShowModal(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            const url = editingCharm
                ? `/api/charms/${editingCharm.id}`
                : '/api/charms'
            const method = editingCharm ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                setShowModal(false)
                fetchCharms()
            }
        } catch (error) {
            console.error('Error saving charm:', error)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this charm?')) return

        try {
            await fetch(`/api/charms/${id}`, { method: 'DELETE' })
            fetchCharms()
        } catch (error) {
            console.error('Error deleting charm:', error)
        }
    }

    const filteredCharms = filterCategory
        ? charms.filter(c => c.category === filterCategory)
        : charms

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
                    <h1 className={styles.title}>Charms</h1>
                    <p className={styles.subtitle}>Manage charms that can be added to jewelry pieces</p>
                </div>
                <button onClick={openCreateModal} className={styles.addBtn}>
                    <span>+</span>
                    Add Charm
                </button>
            </div>

            {/* Filter */}
            {charms.length > 0 && (
                <div style={{ marginBottom: '24px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => setFilterCategory('')}
                        className={styles.badge}
                        style={{
                            cursor: 'pointer',
                            border: filterCategory === '' ? '2px solid #c9a962' : '2px solid transparent',
                            padding: '8px 16px'
                        }}
                    >
                        All ({charms.length})
                    </button>
                    {CHARM_CATEGORIES.map(cat => {
                        const count = charms.filter(c => c.category === cat).length
                        if (count === 0) return null
                        return (
                            <button
                                key={cat}
                                onClick={() => setFilterCategory(cat)}
                                className={styles.badge}
                                style={{
                                    cursor: 'pointer',
                                    border: filterCategory === cat ? '2px solid #c9a962' : '2px solid transparent',
                                    padding: '8px 16px',
                                    textTransform: 'capitalize'
                                }}
                            >
                                {cat} ({count})
                            </button>
                        )
                    })}
                </div>
            )}

            {charms.length === 0 ? (
                <div className={styles.empty}>
                    <div className={styles.emptyIcon}>✨</div>
                    <h3 className={styles.emptyTitle}>No Charms Yet</h3>
                    <p className={styles.emptyText}>Add beautiful charms that customers can add to their jewelry.</p>
                    <button onClick={openCreateModal} className={styles.addBtn}>
                        Add First Charm
                    </button>
                </div>
            ) : (
                <div className={styles.grid}>
                    {filteredCharms.map(charm => (
                        <div key={charm.id} className={styles.card}>
                            <Image
                                src={charm.image || '/placeholder.png'}
                                alt={charm.name}
                                width={400}
                                height={300}
                                className={styles.cardImage}
                            />
                            <div className={styles.cardContent}>
                                <h3 className={styles.cardName}>{charm.name}</h3>
                                <div className={styles.cardMeta}>
                                    <span className={`${styles.badge} ${charm.material === 'silver' ? styles.silver : charm.material === 'rose-gold' ? styles.rosegold : ''}`}>
                                        {charm.material.toUpperCase()}
                                    </span>
                                    {charm.category && (
                                        <span className={styles.badge} style={{ textTransform: 'capitalize' }}>
                                            {charm.category}
                                        </span>
                                    )}
                                    {charm.featured && <span className={`${styles.badge} ${styles.featured}`}>Featured</span>}
                                </div>
                                <div className={styles.price}>
                                    £{charm.price.toFixed(2)}
                                </div>
                                {charm.description && (
                                    <p style={{ color: '#8a8a8a', fontSize: '0.85rem', marginBottom: '16px' }}>
                                        {charm.description}
                                    </p>
                                )}
                                <div className={styles.cardActions}>
                                    <button onClick={() => openEditModal(charm)} className={styles.editBtn}>
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(charm.id)} className={styles.deleteBtn}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>{editingCharm ? 'Edit' : 'Add'} Charm</h2>
                            <button onClick={() => setShowModal(false)} className={styles.closeBtn}>×</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.modalBody}>
                                <div className={styles.formGroup}>
                                    <label>Charm Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g., Golden Heart, Crescent Moon..."
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Describe this charm..."
                                    />
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Price (£)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                                            placeholder="12.00"
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            <option value="">Select category...</option>
                                            {CHARM_CATEGORIES.map(cat => (
                                                <option key={cat} value={cat} style={{ textTransform: 'capitalize' }}>
                                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Material</label>
                                    <select
                                        value={formData.material}
                                        onChange={e => setFormData({ ...formData, material: e.target.value })}
                                    >
                                        <option value="gold">Gold</option>
                                        <option value="silver">Silver</option>
                                        <option value="rose-gold">Rose Gold</option>
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Image URL</label>
                                    <input
                                        type="text"
                                        value={formData.image}
                                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                                        placeholder="/jewelry-assets/charm-heart-gold.png"
                                        required
                                    />
                                    {formData.image && (
                                        <div style={{ marginTop: '12px', textAlign: 'center' }}>
                                            <Image
                                                src={formData.image}
                                                alt="Preview"
                                                width={150}
                                                height={150}
                                                className={styles.imagePreview}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className={styles.formRow}>
                                    <label className={styles.checkbox}>
                                        <input
                                            type="checkbox"
                                            checked={formData.inStock}
                                            onChange={e => setFormData({ ...formData, inStock: e.target.checked })}
                                        />
                                        <span>In Stock</span>
                                    </label>
                                    <label className={styles.checkbox}>
                                        <input
                                            type="checkbox"
                                            checked={formData.featured}
                                            onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                                        />
                                        <span>Featured</span>
                                    </label>
                                </div>
                            </div>
                            <div className={styles.modalFooter}>
                                <button type="button" onClick={() => setShowModal(false)} className={styles.cancelBtn}>
                                    Cancel
                                </button>
                                <button type="submit" className={styles.submitBtn} disabled={saving}>
                                    {saving ? 'Saving...' : (editingCharm ? 'Update' : 'Create')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
