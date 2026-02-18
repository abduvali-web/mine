'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import styles from '../jewelry-builder.module.css'

interface Position {
    id: number
    x: number
    y: number
    side: 'front' | 'back'
    label: string
}

interface JewelryType {
    id: string
    name: string
    supportsCharms: boolean
    maxCharmSlots: number
}

interface JewelryItem {
    id: string
    name: string
    slug: string
    description: string | null
    price: number
    compareAt: number | null
    image: string
    material: string
    length: string | null
    typeId: string
    type: JewelryType
    supportsCharms: boolean
    charmPositions: string
    inStock: boolean
    featured: boolean
}

export default function JewelryItemsPage() {
    const [items, setItems] = useState<JewelryItem[]>([])
    const [types, setTypes] = useState<JewelryType[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingItem, setEditingItem] = useState<JewelryItem | null>(null)
    const [saving, setSaving] = useState(false)
    const [currentSide, setCurrentSide] = useState<'front' | 'back'>('front')

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        compareAt: '',
        image: '',
        material: 'gold',
        length: '',
        typeId: '',
        supportsCharms: true,
        inStock: true,
        featured: false,
    })
    const [positions, setPositions] = useState<Position[]>([])

    const fetchData = useCallback(async () => {
        try {
            const [itemsRes, typesRes] = await Promise.all([
                fetch('/api/jewelry-items'),
                fetch('/api/jewelry-types')
            ])
            const [itemsData, typesData] = await Promise.all([
                itemsRes.json(),
                typesRes.json()
            ])
            setItems(itemsData)
            setTypes(typesData)
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const openCreateModal = () => {
        setEditingItem(null)
        setFormData({
            name: '',
            description: '',
            price: '',
            compareAt: '',
            image: '',
            material: 'gold',
            length: '',
            typeId: types[0]?.id || '',
            supportsCharms: true,
            inStock: true,
            featured: false,
        })
        setPositions([])
        setCurrentSide('front')
        setShowModal(true)
    }

    const openEditModal = (item: JewelryItem) => {
        setEditingItem(item)
        setFormData({
            name: item.name,
            description: item.description || '',
            price: item.price.toString(),
            compareAt: item.compareAt?.toString() || '',
            image: item.image,
            material: item.material,
            length: item.length || '',
            typeId: item.typeId,
            supportsCharms: item.supportsCharms,
            inStock: item.inStock,
            featured: item.featured,
        })
        try {
            setPositions(JSON.parse(item.charmPositions) || [])
        } catch {
            setPositions([])
        }
        setCurrentSide('front')
        setShowModal(true)
    }

    const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!formData.supportsCharms) return

        const rect = e.currentTarget.getBoundingClientRect()
        const x = Math.round(((e.clientX - rect.left) / rect.width) * 100)
        const y = Math.round(((e.clientY - rect.top) / rect.height) * 100)

        const newPosition: Position = {
            id: positions.length + 1,
            x,
            y,
            side: currentSide,
            label: `${currentSide === 'front' ? 'Front' : 'Back'} ${positions.filter(p => p.side === currentSide).length + 1}`
        }

        setPositions([...positions, newPosition])
    }

    const removePosition = (id: number) => {
        setPositions(positions.filter(p => p.id !== id))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            const url = editingItem
                ? `/api/jewelry-items/${editingItem.id}`
                : '/api/jewelry-items'
            const method = editingItem ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    charmPositions: JSON.stringify(positions)
                })
            })

            if (res.ok) {
                setShowModal(false)
                fetchData()
            }
        } catch (error) {
            console.error('Error saving item:', error)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this jewelry item?')) return

        try {
            await fetch(`/api/jewelry-items/${id}`, { method: 'DELETE' })
            fetchData()
        } catch (error) {
            console.error('Error deleting item:', error)
        }
    }

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
                    <h1 className={styles.title}>Jewelry Items</h1>
                    <p className={styles.subtitle}>Manage chains, bracelets, and other base jewelry pieces</p>
                </div>
                <button onClick={openCreateModal} className={styles.addBtn}>
                    <span>+</span>
                    Add Item
                </button>
            </div>

            {items.length === 0 ? (
                <div className={styles.empty}>
                    <div className={styles.emptyIcon}>📿</div>
                    <h3 className={styles.emptyTitle}>No Jewelry Items Yet</h3>
                    <p className={styles.emptyText}>Add your first chain or jewelry item with customizable charm positions.</p>
                    <button onClick={openCreateModal} className={styles.addBtn}>
                        Add First Item
                    </button>
                </div>
            ) : (
                <div className={styles.grid}>
                    {items.map(item => (
                        <div key={item.id} className={styles.card}>
                            <Image
                                src={item.image || '/placeholder.png'}
                                alt={item.name}
                                width={400}
                                height={300}
                                className={styles.cardImage}
                            />
                            <div className={styles.cardContent}>
                                <h3 className={styles.cardName}>{item.name}</h3>
                                <div className={styles.cardMeta}>
                                    <span className={`${styles.badge} ${item.material === 'silver' ? styles.silver : item.material === 'rose-gold' ? styles.rosegold : ''}`}>
                                        {item.material.toUpperCase()}
                                    </span>
                                    {item.length && <span className={styles.badge}>{item.length}</span>}
                                    {item.supportsCharms && (
                                        <span className={`${styles.badge} ${styles.charms}`}>
                                            {(() => {
                                                try {
                                                    return JSON.parse(item.charmPositions).length
                                                } catch {
                                                    return 0
                                                }
                                            })()} Positions
                                        </span>
                                    )}
                                    {item.featured && <span className={`${styles.badge} ${styles.featured}`}>Featured</span>}
                                </div>
                                <div className={styles.price}>
                                    £{item.price.toFixed(2)}
                                    {item.compareAt && (
                                        <span className={styles.compareAt}>£{item.compareAt.toFixed(2)}</span>
                                    )}
                                </div>
                                <div className={styles.cardActions}>
                                    <button onClick={() => openEditModal(item)} className={styles.editBtn}>
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(item.id)} className={styles.deleteBtn}>
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
                    <div className={styles.modal} onClick={e => e.stopPropagation()} style={{ maxWidth: '800px' }}>
                        <div className={styles.modalHeader}>
                            <h2>{editingItem ? 'Edit' : 'Add'} Jewelry Item</h2>
                            <button onClick={() => setShowModal(false)} className={styles.closeBtn}>×</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.modalBody}>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Item Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="e.g., Gold Rope Chain 18&quot;"
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Type</label>
                                        <select
                                            value={formData.typeId}
                                            onChange={e => setFormData({ ...formData, typeId: e.target.value })}
                                            required
                                        >
                                            <option value="">Select type...</option>
                                            {types.map(type => (
                                                <option key={type.id} value={type.id}>{type.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Describe this jewelry item..."
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
                                            placeholder="45.00"
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Compare at Price (Optional)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.compareAt}
                                            onChange={e => setFormData({ ...formData, compareAt: e.target.value })}
                                            placeholder="65.00"
                                        />
                                    </div>
                                </div>

                                <div className={styles.formRow}>
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
                                        <label>Length (Optional)</label>
                                        <input
                                            type="text"
                                            value={formData.length}
                                            onChange={e => setFormData({ ...formData, length: e.target.value })}
                                            placeholder="18in, 20in, etc."
                                        />
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Image URL</label>
                                    <input
                                        type="text"
                                        value={formData.image}
                                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                                        placeholder="/jewelry-assets/chain-rope-gold.png"
                                        required
                                    />
                                </div>

                                <div className={styles.formRow}>
                                    <label className={styles.checkbox}>
                                        <input
                                            type="checkbox"
                                            checked={formData.supportsCharms}
                                            onChange={e => setFormData({ ...formData, supportsCharms: e.target.checked })}
                                        />
                                        <span>Supports Charms</span>
                                    </label>
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

                                {/* Position Picker */}
                                {formData.supportsCharms && formData.image && (
                                    <div className={styles.formGroup} style={{ marginTop: '24px' }}>
                                        <label>Charm Positions</label>
                                        <p style={{ fontSize: '0.85rem', color: '#8a8a8a', marginBottom: '12px' }}>
                                            Click on the image to add charm placement positions. Green dots = Front, Gray dots = Back
                                        </p>

                                        <div className={styles.sideToggle}>
                                            <button
                                                type="button"
                                                className={currentSide === 'front' ? styles.active : ''}
                                                onClick={() => setCurrentSide('front')}
                                            >
                                                Front Side
                                            </button>
                                            <button
                                                type="button"
                                                className={currentSide === 'back' ? styles.active : ''}
                                                onClick={() => setCurrentSide('back')}
                                            >
                                                Back Side
                                            </button>
                                        </div>

                                        <div
                                            className={styles.positionPicker}
                                            onClick={handleImageClick}
                                        >
                                            <Image
                                                src={formData.image}
                                                alt="Position picker"
                                                width={400}
                                                height={400}
                                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                            />
                                            {positions.filter(p => p.side === currentSide).map(pos => (
                                                <div
                                                    key={pos.id}
                                                    className={`${styles.positionDot} ${pos.side === 'back' ? styles.back : ''}`}
                                                    style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                                                    onClick={e => {
                                                        e.stopPropagation()
                                                        removePosition(pos.id)
                                                    }}
                                                >
                                                    {pos.id}
                                                </div>
                                            ))}
                                        </div>

                                        <div className={styles.positionsList}>
                                            {positions.map(pos => (
                                                <div key={pos.id} className={styles.positionTag}>
                                                    <span>#{pos.id} - {pos.side}</span>
                                                    <span>({pos.x}%, {pos.y}%)</span>
                                                    <button type="button" onClick={() => removePosition(pos.id)}>×</button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className={styles.modalFooter}>
                                <button type="button" onClick={() => setShowModal(false)} className={styles.cancelBtn}>
                                    Cancel
                                </button>
                                <button type="submit" className={styles.submitBtn} disabled={saving}>
                                    {saving ? 'Saving...' : (editingItem ? 'Update' : 'Create')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
