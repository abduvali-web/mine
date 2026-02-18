'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import styles from '../jewelry-builder.module.css'

interface JewelryType {
    id: string
    name: string
    slug: string
    description: string | null
    supportsCharms: boolean
    maxCharmSlots: number
    _count?: { jewelryItems: number }
}

export default function JewelryTypesPage() {
    const [types, setTypes] = useState<JewelryType[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingType, setEditingType] = useState<JewelryType | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        supportsCharms: true,
        maxCharmSlots: 12
    })
    const [saving, setSaving] = useState(false)

    const fetchTypes = useCallback(async () => {
        try {
            const res = await fetch('/api/jewelry-types')
            const data = await res.json()
            setTypes(data)
        } catch (error) {
            console.error('Error fetching types:', error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchTypes()
    }, [fetchTypes])

    const openCreateModal = () => {
        setEditingType(null)
        setFormData({
            name: '',
            description: '',
            supportsCharms: true,
            maxCharmSlots: 12
        })
        setShowModal(true)
    }

    const openEditModal = (type: JewelryType) => {
        setEditingType(type)
        setFormData({
            name: type.name,
            description: type.description || '',
            supportsCharms: type.supportsCharms,
            maxCharmSlots: type.maxCharmSlots
        })
        setShowModal(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            const url = editingType
                ? `/api/jewelry-types/${editingType.id}`
                : '/api/jewelry-types'
            const method = editingType ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                setShowModal(false)
                fetchTypes()
            }
        } catch (error) {
            console.error('Error saving type:', error)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this jewelry type?')) return

        try {
            await fetch(`/api/jewelry-types/${id}`, { method: 'DELETE' })
            fetchTypes()
        } catch (error) {
            console.error('Error deleting type:', error)
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
                    <h1 className={styles.title}>Jewelry Types</h1>
                    <p className={styles.subtitle}>Manage jewelry categories (Necklaces, Bracelets, Rings, etc.)</p>
                </div>
                <button onClick={openCreateModal} className={styles.addBtn}>
                    <span>+</span>
                    Add Type
                </button>
            </div>

            {types.length === 0 ? (
                <div className={styles.empty}>
                    <div className={styles.emptyIcon}>💎</div>
                    <h3 className={styles.emptyTitle}>No Jewelry Types Yet</h3>
                    <p className={styles.emptyText}>Create your first jewelry type to start building your catalog.</p>
                    <button onClick={openCreateModal} className={styles.addBtn}>
                        Create First Type
                    </button>
                </div>
            ) : (
                <div className={styles.grid}>
                    {types.map(type => (
                        <div key={type.id} className={styles.card}>
                            <div className={styles.cardContent}>
                                <h3 className={styles.cardName}>{type.name}</h3>
                                <div className={styles.cardMeta}>
                                    {type.supportsCharms ? (
                                        <span className={`${styles.badge} ${styles.charms}`}>
                                            {type.maxCharmSlots} Charm Slots
                                        </span>
                                    ) : (
                                        <span className={styles.badge}>No Charms</span>
                                    )}
                                    <span className={styles.badge}>
                                        {type._count?.jewelryItems || 0} Items
                                    </span>
                                </div>
                                {type.description && (
                                    <p style={{ color: '#8a8a8a', fontSize: '0.9rem', marginBottom: '16px' }}>
                                        {type.description}
                                    </p>
                                )}
                                <div className={styles.cardActions}>
                                    <button
                                        onClick={() => openEditModal(type)}
                                        className={styles.editBtn}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(type.id)}
                                        className={styles.deleteBtn}
                                    >
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
                            <h2>{editingType ? 'Edit' : 'Add'} Jewelry Type</h2>
                            <button onClick={() => setShowModal(false)} className={styles.closeBtn}>×</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.modalBody}>
                                <div className={styles.formGroup}>
                                    <label>Type Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g., Necklaces, Bracelets, Rings..."
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Brief description of this jewelry type..."
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.checkbox}>
                                        <input
                                            type="checkbox"
                                            checked={formData.supportsCharms}
                                            onChange={e => setFormData({ ...formData, supportsCharms: e.target.checked })}
                                        />
                                        <span>Supports Charms</span>
                                    </label>
                                </div>
                                {formData.supportsCharms && (
                                    <div className={styles.formGroup}>
                                        <label>Maximum Charm Slots</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="24"
                                            value={formData.maxCharmSlots}
                                            onChange={e => setFormData({ ...formData, maxCharmSlots: parseInt(e.target.value) || 12 })}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className={styles.modalFooter}>
                                <button type="button" onClick={() => setShowModal(false)} className={styles.cancelBtn}>
                                    Cancel
                                </button>
                                <button type="submit" className={styles.submitBtn} disabled={saving}>
                                    {saving ? 'Saving...' : (editingType ? 'Update' : 'Create')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
