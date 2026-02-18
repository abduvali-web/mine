'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './editor.module.css'

interface ProductEditorProps {
    product?: any
    categories: any[]
}

export default function ProductEditor({ product, categories }: ProductEditorProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)

    const [formData, setFormData] = useState({
        name: product?.name || '',
        price: product?.price || '',
        compareAt: product?.compareAt || '',
        description: product?.description || '',
        categoryId: product?.categoryId || categories[0]?.id || '',
        images: product?.images ? JSON.parse(product.images) : [],
        featured: product?.featured || false,
        inStock: product?.inStock ?? true
    })

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return

        setUploading(true)
        const file = e.target.files[0]
        const data = new FormData()
        data.append('file', file)

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: data
            })
            const json = await res.json()
            if (json.url) {
                setFormData(prev => ({
                    ...prev,
                    images: [...prev.images, json.url]
                }))
            }
        } catch (err) {
            console.error('Upload failed', err)
            alert('Upload failed')
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const url = product ? `/api/products/${product.id}` : '/api/products'
            const method = product ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    compareAt: formData.compareAt ? parseFloat(formData.compareAt) : null,
                    images: JSON.stringify(formData.images)
                })
            })

            if (res.ok) {
                router.push('/admin/products')
                router.refresh()
            } else {
                alert('Save failed')
            }
        } catch (err) {
            alert('Error saving product')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>{product ? 'Edit Product' : 'New Product'}</h1>
            </header>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.grid}>
                    <div className={styles.field}>
                        <label className={styles.label}>Product Name</label>
                        <input name="name" value={formData.name} onChange={handleChange} className={styles.input} required />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Category</label>
                        <select name="categoryId" value={formData.categoryId} onChange={handleChange} className={styles.select}>
                            {categories.map((c: any) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className={styles.grid}>
                    <div className={styles.field}>
                        <label className={styles.label}>Price (£)</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} className={styles.input} step="0.01" required />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Compare At Price (£)</label>
                        <input type="number" name="compareAt" value={formData.compareAt} onChange={handleChange} className={styles.input} step="0.01" />
                    </div>
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} className={styles.textarea} required />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Images</label>
                    <div className={styles.imageUpload}>
                        <input type="file" onChange={handleImageUpload} accept="image/*" style={{ display: 'none' }} id="file-upload" />
                        <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
                            {uploading ? 'Uploading...' : 'Click to Upload Image'}
                        </label>
                    </div>
                    <div className={styles.previewGrid}>
                        {formData.images.map((img: string, i: number) => (
                            <img key={i} src={img} className={styles.preview} alt={`Preview ${i}`} />
                        ))}
                    </div>
                </div>

                <div className={styles.checkboxGroup}>
                    <label className={styles.checkbox}>
                        <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} />
                        Featured Product
                    </label>
                    <label className={styles.checkbox}>
                        <input type="checkbox" name="inStock" checked={formData.inStock} onChange={handleChange} />
                        In Stock
                    </label>
                </div>

                <div className={styles.actions}>
                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? 'Saving...' : 'Save Product'}
                    </button>
                    <Link href="/admin/products" className={styles.cancelBtn}>Cancel</Link>
                </div>
            </form>
        </div>
    )
}
