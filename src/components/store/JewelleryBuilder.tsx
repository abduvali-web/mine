'use client'

import { useState } from 'react'
import styles from './JewelleryBuilder.module.css'

export default function JewelleryBuilder() {
    const [step, setStep] = useState(1)

    const [config, setConfig] = useState({
        base: '',
        material: '',
        charm: '',
        customImage: '',
        engraving: ''
    })

    const [uploading, setUploading] = useState(false)

    const handleSelect = (key: string, value: string) => {
        setConfig(prev => ({ ...prev, [key]: value }))
    }

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return
        setUploading(true)

        try {
            const formData = new FormData()
            formData.append('file', e.target.files[0])

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            })
            const data = await res.json()
            if (data.url) {
                handleSelect('customImage', data.url)
            }
        } catch (err) {
            alert('Upload failed. Please try again.')
        } finally {
            setUploading(false)
        }
    }

    const handleAddToCart = () => {
        // Construct a "product" from the config
        const customProduct = {
            id: `custom-${Date.now()}`,
            name: `Custom ${config.base} (${config.material})`,
            price: 150.00, // Flat fee for custom
            quantity: 1,
            // Store details in personalization or a special field if cart supports it
            personalization: `Engraving: ${config.engraving || 'None'}, Charm: ${config.charm || 'None'}, Custom Image: ${config.customImage ? 'Yes' : 'No'}`
        }

        const cart = JSON.parse(localStorage.getItem('cart') || '[]')
        cart.push(customProduct)
        localStorage.setItem('cart', JSON.stringify(cart))

        alert('Custom design added to cart!')
        window.location.href = '/cart'
    }

    return (
        <div className={styles.builderContainer}>
            <div className={styles.builderHeader}>
                <h2 className={styles.builderTitle}>Custom Design Studio</h2>
                <div className={styles.stepIndicator}>
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className={`${styles.stepDot} ${step >= i ? styles.active : ''}`} />
                    ))}
                </div>
            </div>

            <div className={styles.builderContent}>
                {step === 1 && (
                    <>
                        <h3 className={styles.sectionTitle}>1. Choose Your Base</h3>
                        <div className={styles.selectionGrid}>
                            <div
                                className={`${styles.optionCard} ${config.base === 'Necklace' ? styles.selected : ''}`}
                                onClick={() => handleSelect('base', 'Necklace')}
                            >
                                <span className={styles.optionImage}>📿</span>
                                <span className={styles.optionName}>Necklace</span>
                            </div>
                            <div
                                className={`${styles.optionCard} ${config.base === 'Bracelet' ? styles.selected : ''}`}
                                onClick={() => handleSelect('base', 'Bracelet')}
                            >
                                <span className={styles.optionImage}>💍</span>
                                <span className={styles.optionName}>Bracelet</span>
                            </div>
                            <div
                                className={`${styles.optionCard} ${config.base === 'Ring' ? styles.selected : ''}`}
                                onClick={() => handleSelect('base', 'Ring')}
                            >
                                <span className={styles.optionImage}>💎</span>
                                <span className={styles.optionName}>Ring</span>
                            </div>
                        </div>
                    </>
                )}

                {step === 2 && (
                    <>
                        <h3 className={styles.sectionTitle}>2. Select Material</h3>
                        <div className={styles.selectionGrid}>
                            <div
                                className={`${styles.optionCard} ${config.material === 'Gold' ? styles.selected : ''}`}
                                onClick={() => handleSelect('material', 'Gold')}
                            >
                                <span className={styles.optionImage} style={{ color: '#FFD700' }}>●</span>
                                <span className={styles.optionName}>18K Gold Plated</span>
                            </div>
                            <div
                                className={`${styles.optionCard} ${config.material === 'Silver' ? styles.selected : ''}`}
                                onClick={() => handleSelect('material', 'Silver')}
                            >
                                <span className={styles.optionImage} style={{ color: '#C0C0C0' }}>●</span>
                                <span className={styles.optionName}>Sterling Silver</span>
                            </div>
                            <div
                                className={`${styles.optionCard} ${config.material === 'Rose Gold' ? styles.selected : ''}`}
                                onClick={() => handleSelect('material', 'Rose Gold')}
                            >
                                <span className={styles.optionImage} style={{ color: '#B76E79' }}>●</span>
                                <span className={styles.optionName}>Rose Gold</span>
                            </div>
                        </div>
                    </>
                )}

                {step === 3 && (
                    <>
                        <h3 className={styles.sectionTitle}>3. Personalize It (Engraving)</h3>
                        <div className={styles.inputGroup}>
                            <input
                                type="text"
                                placeholder="Enter name, date, or message..."
                                className={styles.textInput}
                                value={config.engraving}
                                onChange={(e) => handleSelect('engraving', e.target.value)}
                                maxLength={30}
                            />
                            <p style={{ textAlign: 'center', color: '#888', fontSize: '0.9rem' }}>Optional: Max 30 characters</p>
                        </div>
                    </>
                )}

                {step === 4 && (
                    <>
                        <h3 className={styles.sectionTitle}>4. Add Custom Image (Optional)</h3>
                        <div className={styles.inputGroup}>
                            <label className={styles.uploadZone}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleUpload}
                                />
                                {uploading ? <p>Uploading...</p> : (
                                    <>
                                        <p style={{ fontSize: '2rem', margin: 0 }}>☁️</p>
                                        <p>Click to upload your custom design</p>
                                        <p style={{ fontSize: '0.8rem', color: '#888' }}>Supports PNG, JPG (Max 5MB)</p>
                                    </>
                                )}
                            </label>

                            {config.customImage && (
                                <div style={{ textAlign: 'center' }}>
                                    <p>Preview:</p>
                                    <img src={config.customImage} alt="Custom upload" className={styles.uploadPreview} />
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            <div className={styles.builderActions}>
                {step > 1 ? (
                    <button className={`${styles.btn} ${styles.backBtn}`} onClick={() => setStep(step - 1)}>
                        Back
                    </button>
                ) : (
                    <div></div> // Spacer
                )}

                {step < 4 ? (
                    <button
                        className={`${styles.btn} ${styles.nextBtn}`}
                        onClick={() => setStep(step + 1)}
                        disabled={step === 1 && !config.base || step === 2 && !config.material}
                    >
                        Next Step
                    </button>
                ) : (
                    <button className={`${styles.btn} ${styles.finishBtn}`} onClick={handleAddToCart}>
                        Add Custom Design to Cart (£150.00)
                    </button>
                )}
            </div>
        </div>
    )
}
