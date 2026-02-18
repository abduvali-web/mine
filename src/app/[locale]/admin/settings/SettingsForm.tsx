'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './settings.module.css'

interface Settings {
    storeName: string
    storeEmail: string
    currency: string
    shippingFee: number
    freeShipMin: number
    heroTitle: string
    heroSubtitle: string
    footerText: string
}

export default function SettingsForm({ initialSettings }: { initialSettings: Settings }) {
    const [settings, setSettings] = useState(initialSettings)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setSettings(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            })
            if (res.ok) {
                alert('Settings saved successfully!')
                router.refresh()
            } else {
                alert('Failed to save settings')
            }
        } catch (err) {
            console.error(err)
            alert('Error saving settings')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>General Information</h2>
                <div className={styles.grid}>
                    <div className={styles.field}>
                        <label className={styles.label}>Store Name</label>
                        <input
                            name="storeName"
                            value={settings.storeName || ''}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Store Email</label>
                        <input
                            name="storeEmail"
                            value={settings.storeEmail || ''}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>Shipping & Currency</h2>
                <div className={styles.grid}>
                    <div className={styles.field}>
                        <label className={styles.label}>Currency Symbol</label>
                        <input
                            name="currency"
                            value={settings.currency || ''}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Shipping Fee</label>
                        <input
                            type="number"
                            name="shippingFee"
                            value={settings.shippingFee || 0}
                            onChange={handleChange}
                            className={styles.input}
                            step="0.01"
                        />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Free Shipping Minimum</label>
                        <input
                            type="number"
                            name="freeShipMin"
                            value={settings.freeShipMin || 0}
                            onChange={handleChange}
                            className={styles.input}
                            step="0.01"
                        />
                    </div>
                </div>
            </div>

            <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>Hero Section & Footer</h2>
                <div className={styles.field}>
                    <label className={styles.label}>Hero Title</label>
                    <input
                        name="heroTitle"
                        value={settings.heroTitle || ''}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>
                <div className={styles.field}>
                    <label className={styles.label}>Hero Subtitle</label>
                    <input
                        name="heroSubtitle"
                        value={settings.heroSubtitle || ''}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>
                <div className={styles.field}>
                    <label className={styles.label}>Footer Text</label>
                    <input
                        name="footerText"
                        value={settings.footerText || ''}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>
            </div>

            <button type="submit" className={styles.saveBtn} disabled={loading}>
                {loading ? 'Saving...' : 'Save Settings'}
            </button>
        </form>
    )
}
