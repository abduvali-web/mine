'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import styles from './InteractiveBuilder.module.css'

interface Position {
    id: number
    x: number
    y: number
    side: 'front' | 'back'
    label: string
}

interface JewelryItem {
    id: string
    name: string
    price: number
    image: string
    material: string
    length: string | null
    charmPositions: string
    type: { name: string }
}

interface Charm {
    id: string
    name: string
    price: number
    image: string
    category: string | null
    material: string
}

interface PlacedCharm {
    positionId: number
    charm: Charm
}

export default function InteractiveBuilder() {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(true)
    const [jewelryItems, setJewelryItems] = useState<JewelryItem[]>([])
    const [charms, setCharms] = useState<Charm[]>([])

    // Selected state
    const [selectedChain, setSelectedChain] = useState<JewelryItem | null>(null)
    const [placedCharms, setPlacedCharms] = useState<PlacedCharm[]>([])
    const [tags, setTags] = useState<string[]>([])
    const [tagInput, setTagInput] = useState('')
    const [designName, setDesignName] = useState('')

    // UI state
    const [currentSide, setCurrentSide] = useState<'front' | 'back'>('front')
    const [selectedCharmForPlacement, setSelectedCharmForPlacement] = useState<Charm | null>(null)
    const [charmCategory, setCharmCategory] = useState('')
    const [showShareModal, setShowShareModal] = useState(false)
    const [shareCode, setShareCode] = useState('')
    const [slotCount, setSlotCount] = useState(10)

    // In Nextjs 13+, useSearchParams must be used inside Suspense (usually moved to wrapper)
    // But since this is a client component likely generated dynamically, we can use it.
    const searchParams = useSearchParams()
    const router = useRouter()

    const fetchData = useCallback(async () => {
        try {
            const [itemsRes, charmsRes] = await Promise.all([
                fetch('/api/jewelry-items'),
                fetch('/api/charms')
            ])
            const [itemsData, charmsData] = await Promise.all([
                itemsRes.json(),
                charmsRes.json()
            ])
            setJewelryItems(itemsData.filter((i: JewelryItem) => i.charmPositions && i.charmPositions !== '[]'))
            setCharms(charmsData)
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    // Load shared design or category/step params
    useEffect(() => {
        const designCode = searchParams?.get('design')
        const paramStep = searchParams?.get('step')
        const paramCategory = searchParams?.get('category')

        if (designCode && jewelryItems.length > 0) {
            fetch(`/api/custom-designs?code=${designCode}`)
                .then(res => res.json())
                .then(data => {
                    if (data && !data.error) {
                        const item = jewelryItems.find(i => i.id === data.jewelryItemId)
                        if (item) {
                            setSelectedChain(item)
                            setPlacedCharms(JSON.parse(data.charmPlacements))
                            setDesignName(data.name || '')
                            setTags(JSON.parse(data.tags))
                            setStep(2) // Jump to customize
                        }
                    }
                })
                .catch(err => console.error('Failed to load design:', err))
        } else if (paramStep && jewelryItems.length > 0) {
            // Handle direct step navigation (e.g. from Mega Menu)
            const stepNum = parseInt(paramStep)
            if (stepNum === 1) {
                setStep(1)
            } else if (stepNum === 2) {
                // To go to step 2 we need a chain selected. If none, maybe pick default or first?
                // Or just set the step and let the UI handle empty state (it shows "Select charms" but no chain preview?
                // The current UI requires selectedChain for Step 2 preview panel.
                // If no chain selected, we should probably stay on Step 1 or select a default chain.
                // Let's select the first chain for now if none selected, to improve UX.
                if (!selectedChain) {
                    setSelectedChain(jewelryItems[0])
                }
                setStep(2)
            }
            if (paramCategory) {
                setCharmCategory(paramCategory)
            }
        }
    }, [searchParams, jewelryItems, selectedChain])

    const getPositions = (): Position[] => {
        // Generate dynamic positions based on slotCount
        const positions: Position[] = []

        // Calculate positions along U-shape curve
        for (let i = 0; i < slotCount; i++) {
            const progress = i / (slotCount - 1) // 0 to 1

            // Parabolic curve for U-shape
            // x goes from 20% to 80%
            const x = 20 + (progress * 60)

            // y follows parabola: starts at 25%, goes down to 72%, back up to 25%
            // Using quadratic formula: y = a(x - h)² + k
            // Where vertex is at center (50%, 72%)
            const centerX = 50
            const topY = 25
            const bottomY = 72
            const a = (topY - bottomY) / Math.pow(30, 2) // coefficient for parabola
            const y = a * Math.pow(x - centerX, 2) + bottomY

            // Front positions
            positions.push({
                id: i + 1,
                x: Math.round(x),
                y: Math.round(y),
                side: 'front',
                label: `Slot ${i + 1}`
            })

            // Back positions (mirrored)
            positions.push({
                id: slotCount + i + 1,
                x: Math.round(80 - (x - 20)), // mirror horizontally
                y: Math.round(y),
                side: 'back',
                label: `Slot ${i + 1}`
            })
        }

        return positions
    }

    const getCurrentSidePositions = () => {
        return getPositions().filter(p => p.side === currentSide)
    }

    const handleChainSelect = (chain: JewelryItem) => {
        setSelectedChain(chain)
        setPlacedCharms([])
        setStep(2)
    }

    const handleCharmClick = (charm: Charm) => {
        setSelectedCharmForPlacement(charm)
    }

    const handleSlotClick = (positionId: number) => {
        if (selectedCharmForPlacement) {
            // Check if slot is already filled
            const existingIndex = placedCharms.findIndex(p => p.positionId === positionId)
            if (existingIndex >= 0) {
                // Replace existing charm
                const newPlacements = [...placedCharms]
                newPlacements[existingIndex] = { positionId, charm: selectedCharmForPlacement }
                setPlacedCharms(newPlacements)
            } else {
                // Add new charm
                setPlacedCharms([...placedCharms, { positionId, charm: selectedCharmForPlacement }])
            }
            setSelectedCharmForPlacement(null)
        }
    }

    const removeCharm = (positionId: number) => {
        setPlacedCharms(placedCharms.filter(p => p.positionId !== positionId))
    }

    const handleTagKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            const tag = tagInput.trim().toLowerCase()
            if (tag && !tags.includes(tag)) {
                setTags([...tags, tag])
            }
            setTagInput('')
        }
    }

    const removeTag = (tag: string) => {
        setTags(tags.filter(t => t !== tag))
    }

    const calculateTotal = () => {
        const chainPrice = selectedChain?.price || 0
        const charmsPrice = placedCharms.reduce((sum, p) => sum + p.charm.price, 0)
        return chainPrice + charmsPrice
    }

    const uniqueCategories = [...new Set(charms.map(c => c.category).filter(Boolean))]
    const filteredCharms = charmCategory
        ? charms.filter(c => c.category === charmCategory)
        : charms

    const handleShare = async () => {
        if (!selectedChain) return

        try {
            const res = await fetch('/api/custom-designs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jewelryItemId: selectedChain.id,
                    charmPlacements: placedCharms,
                    name: designName,
                    tags,
                    totalPrice: calculateTotal(),
                    isPublic: true // Make public for community
                })
            })

            if (res.ok) {
                const data = await res.json()
                setShareCode(data.shareCode)
                setShowShareModal(true)

                // Update URL without reload
                router.replace(`/build-your-own?design=${data.shareCode}`, { scroll: false })
            } else {
                alert('Failed to save design. Please try again.')
            }
        } catch (error) {
            console.error('Share error:', error)
            alert('Error sharing design')
        }
    }

    const handleAddToCart = () => {
        if (!selectedChain) return

        const customProduct = {
            id: `custom-${Date.now()}`,
            name: designName || `Custom ${selectedChain.name}`,
            price: calculateTotal(),
            quantity: 1,
            image: selectedChain.image,
            type: 'custom_design',
            details: {
                chain: {
                    id: selectedChain.id,
                    name: selectedChain.name,
                    price: selectedChain.price
                },
                charms: placedCharms.map(p => ({
                    positionId: p.positionId,
                    charmId: p.charm.id,
                    name: p.charm.name,
                    price: p.charm.price
                })),
                tags
            }
        }

        const cart = JSON.parse(localStorage.getItem('cart') || '[]')
        cart.push(customProduct)
        localStorage.setItem('cart', JSON.stringify(cart))

        window.location.href = '/cart'
    }

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    border: '3px solid #f0f0f0',
                    borderTopColor: '#c9a962',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                }} />
            </div>
        )
    }

    return (
        <div className={styles.builderContainer}>
            {/* Progress Bar */}
            <div className={styles.progressBar}>
                <div className={styles.progressStep}>
                    <div className={`${styles.stepNumber} ${step >= 1 ? styles.active : ''} ${step > 1 ? styles.completed : ''}`}>
                        {step > 1 ? '✓' : '1'}
                    </div>
                    <span className={styles.stepLabel}>Choose Chain</span>
                </div>
                <div className={`${styles.stepDivider} ${step > 1 ? styles.active : ''}`} />
                <div className={styles.progressStep}>
                    <div className={`${styles.stepNumber} ${step >= 2 ? styles.active : ''} ${step > 2 ? styles.completed : ''}`}>
                        {step > 2 ? '✓' : '2'}
                    </div>
                    <span className={styles.stepLabel}>Add Charms</span>
                </div>
                <div className={`${styles.stepDivider} ${step > 2 ? styles.active : ''}`} />
                <div className={styles.progressStep}>
                    <div className={`${styles.stepNumber} ${step >= 3 ? styles.active : ''}`}>3</div>
                    <span className={styles.stepLabel}>Finalize</span>
                </div>
            </div>

            <div className={styles.builderLayout}>
                {/* Left Panel - Selection */}
                <div className={styles.selectionPanel}>
                    {/* Step 1: Choose Chain */}
                    {step === 1 && (
                        <>
                            <h2 className={styles.sectionTitle}>Choose Your Chain</h2>
                            <p className={styles.sectionSubtitle}>Select a beautiful chain as the foundation for your custom piece</p>

                            {jewelryItems.length === 0 ? (
                                <div className={styles.emptySlots}>
                                    <span>📿</span>
                                    <p>No chains available yet. Check back soon!</p>
                                </div>
                            ) : (
                                <div className={styles.chainGrid}>
                                    {jewelryItems.map(item => (
                                        <div
                                            key={item.id}
                                            className={`${styles.chainCard} ${selectedChain?.id === item.id ? styles.selected : ''}`}
                                            onClick={() => handleChainSelect(item)}
                                        >
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                width={200}
                                                height={200}
                                                className={styles.chainImage}
                                            />
                                            <h3 className={styles.chainName}>{item.name}</h3>
                                            <p className={styles.chainMeta}>
                                                {item.material.toUpperCase()} {item.length && `• ${item.length}`}
                                            </p>
                                            <p className={styles.chainPrice}>£{item.price.toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {/* Step 2: Add Charms */}
                    {step === 2 && (
                        <>
                            <h2 className={styles.sectionTitle}>Add Your Charms</h2>
                            <p className={styles.sectionSubtitle}>Select charms and click on a position to place them</p>

                            {/* Category Filter */}
                            <div className={styles.charmCategories}>
                                <button
                                    className={`${styles.categoryBtn} ${!charmCategory ? styles.active : ''}`}
                                    onClick={() => setCharmCategory('')}
                                >
                                    All
                                </button>
                                {uniqueCategories.map(cat => (
                                    <button
                                        key={cat}
                                        className={`${styles.categoryBtn} ${charmCategory === cat ? styles.active : ''}`}
                                        onClick={() => setCharmCategory(cat || '')}
                                        style={{ textTransform: 'capitalize' }}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            {/* Charms Grid */}
                            <div className={styles.charmGrid}>
                                {filteredCharms.map(charm => (
                                    <div
                                        key={charm.id}
                                        className={`${styles.charmCard} ${selectedCharmForPlacement?.id === charm.id ? styles.selected : ''}`}
                                        onClick={() => handleCharmClick(charm)}
                                    >
                                        <Image
                                            src={charm.image}
                                            alt={charm.name}
                                            width={80}
                                            height={80}
                                            className={styles.charmImage}
                                        />
                                        <h4 className={styles.charmName}>{charm.name}</h4>
                                        <p className={styles.charmPrice}>£{charm.price.toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Placed Charms */}
                            {placedCharms.length > 0 && (
                                <div className={styles.placedCharms}>
                                    <h4 style={{ marginBottom: '12px' }}>Placed Charms ({placedCharms.length})</h4>
                                    {placedCharms.map(p => (
                                        <div key={p.positionId} className={styles.placedCharmItem}>
                                            <Image
                                                src={p.charm.image}
                                                alt={p.charm.name}
                                                width={40}
                                                height={40}
                                            />
                                            <div className={styles.placedCharmInfo}>
                                                <h4>{p.charm.name}</h4>
                                                <p>Position {p.positionId} • £{p.charm.price.toFixed(2)}</p>
                                            </div>
                                            <button
                                                className={styles.removeCharmBtn}
                                                onClick={() => removeCharm(p.positionId)}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className={styles.navButtons}>
                                <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={() => setStep(1)}>
                                    ← Back
                                </button>
                                <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={() => setStep(3)}>
                                    Continue →
                                </button>
                            </div>
                        </>
                    )}

                    {/* Step 3: Finalize */}
                    {step === 3 && (
                        <>
                            <h2 className={styles.sectionTitle}>Finalize Your Design</h2>
                            <p className={styles.sectionSubtitle}>Name your creation and add tags for sharing</p>

                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                                    Design Name
                                </label>
                                <input
                                    type="text"
                                    value={designName}
                                    onChange={e => setDesignName(e.target.value)}
                                    placeholder="e.g., Celestial Dreams, My Lucky Charm..."
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px',
                                        border: '1px solid #e5e5e5',
                                        borderRadius: '10px',
                                        fontSize: '0.95rem'
                                    }}
                                />
                            </div>

                            <div className={styles.tagsSection}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                                    Tags (press Enter to add)
                                </label>
                                <div className={styles.tagsInput}>
                                    {tags.map(tag => (
                                        <span key={tag} className={styles.tag}>
                                            #{tag}
                                            <button onClick={() => removeTag(tag)}>×</button>
                                        </span>
                                    ))}
                                    <input
                                        type="text"
                                        value={tagInput}
                                        onChange={e => setTagInput(e.target.value)}
                                        onKeyDown={handleTagKeyDown}
                                        placeholder="Add tags..."
                                    />
                                </div>
                            </div>

                            {/* Price Summary */}
                            <div className={styles.priceSummary}>
                                <div className={styles.priceRow}>
                                    <span>Chain ({selectedChain?.name})</span>
                                    <span>£{selectedChain?.price.toFixed(2)}</span>
                                </div>
                                {placedCharms.map(p => (
                                    <div key={p.positionId} className={styles.priceRow}>
                                        <span>{p.charm.name}</span>
                                        <span>£{p.charm.price.toFixed(2)}</span>
                                    </div>
                                ))}
                                <div className={`${styles.priceRow} ${styles.total}`}>
                                    <span>Total</span>
                                    <span>£{calculateTotal().toFixed(2)}</span>
                                </div>
                            </div>

                            <div className={styles.builderActions}>
                                <button className={`${styles.actionBtn} ${styles.shareBtn}`} onClick={handleShare}>
                                    🔗 Share
                                </button>
                                <button
                                    className={`${styles.actionBtn} ${styles.addToCartBtn}`}
                                    onClick={handleAddToCart}
                                    disabled={!selectedChain}
                                >
                                    🛒 Add to Cart
                                </button>
                            </div>

                            <div className={styles.navButtons}>
                                <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={() => setStep(2)}>
                                    ← Back
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* Right Panel - Preview */}
                {selectedChain && (
                    <div className={styles.previewPanel}>
                        <div className={styles.previewHeader}>
                            <h3 className={styles.previewTitle}>Preview</h3>
                        </div>

                        <div className={styles.previewCanvas}>
                            <Image
                                src={selectedChain.image}
                                alt={selectedChain.name}
                                fill
                                className={styles.previewImage}
                            />

                            {/* Charm Slots */}
                            {getCurrentSidePositions().map(pos => {
                                const placed = placedCharms.find(p => p.positionId === pos.id)
                                return (
                                    <div
                                        key={pos.id}
                                        className={`${styles.charmSlot} ${placed ? styles.filled : ''}`}
                                        style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                                        onClick={() => handleSlotClick(pos.id)}
                                        title={pos.label}
                                    >
                                        {placed ? (
                                            <Image
                                                src={placed.charm.image}
                                                alt={placed.charm.name}
                                                width={36}
                                                height={36}
                                            />
                                        ) : (
                                            <span className={styles.slotNumber}>{pos.id}</span>
                                        )}
                                    </div>
                                )
                            })}
                        </div>

                        {selectedCharmForPlacement && (
                            <div style={{
                                padding: '12px',
                                background: 'rgba(201, 169, 98, 0.1)',
                                borderRadius: '10px',
                                textAlign: 'center',
                                fontSize: '0.85rem',
                                color: '#a68b4b'
                            }}>
                                Click a slot to place: <strong>{selectedCharmForPlacement.name}</strong>
                            </div>
                        )}

                        <p style={{ textAlign: 'center', color: '#8a8a8a', fontSize: '0.85rem', marginTop: '16px' }}>
                            Click on a charm, then click a numbered slot to place it
                        </p>

                        {/* Slot Count Controls */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            padding: '12px',
                            background: '#f8f8f8',
                            borderRadius: '10px',
                            fontSize: '0.85rem',
                            marginTop: '12px'
                        }}>
                            <span style={{ fontWeight: '500', color: '#666' }}>Number of Slots:</span>
                            <button
                                onClick={() => setSlotCount(Math.max(4, slotCount - 1))}
                                disabled={slotCount <= 4}
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '8px',
                                    border: '1px solid #ddd',
                                    background: slotCount <= 4 ? '#f0f0f0' : '#fff',
                                    color: slotCount <= 4 ? '#ccc' : '#c9a962',
                                    cursor: slotCount <= 4 ? 'not-allowed' : 'pointer',
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s'
                                }}
                            >
                                −
                            </button>
                            <span style={{
                                minWidth: '35px',
                                textAlign: 'center',
                                fontWeight: '700',
                                color: '#c9a962',
                                fontSize: '1rem'
                            }}>
                                {slotCount}
                            </span>
                            <button
                                onClick={() => setSlotCount(Math.min(20, slotCount + 1))}
                                disabled={slotCount >= 20}
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '8px',
                                    border: '1px solid #ddd',
                                    background: slotCount >= 20 ? '#f0f0f0' : '#fff',
                                    color: slotCount >= 20 ? '#ccc' : '#c9a962',
                                    cursor: slotCount >= 20 ? 'not-allowed' : 'pointer',
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s'
                                }}
                            >
                                +
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Share Modal */}
            {showShareModal && (
                <div className={styles.shareModal} onClick={() => setShowShareModal(false)}>
                    <div className={styles.shareModalContent} onClick={e => e.stopPropagation()}>
                        <h3>Share Your Design ✨</h3>
                        <p style={{ textAlign: 'center', color: '#8a8a8a', marginBottom: '24px' }}>
                            Share this unique design with friends! If someone purchases your design, you&apos;ll earn 5% in discount coins!
                        </p>

                        <div className={styles.shareLinkBox}>
                            <input
                                type="text"
                                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/build-your-own?design=${shareCode}`}
                                readOnly
                            />
                            <button
                                className={styles.copyBtn}
                                onClick={() => {
                                    navigator.clipboard.writeText(`${window.location.origin}/build-your-own?design=${shareCode}`)
                                    alert('Link copied!')
                                }}
                            >
                                Copy
                            </button>
                        </div>

                        <div className={styles.shareOptions}>
                            <div className={`${styles.shareOption} ${styles.whatsapp}`}>📱</div>
                            <div className={`${styles.shareOption} ${styles.twitter}`}>🐦</div>
                            <div className={`${styles.shareOption} ${styles.facebook}`}>📘</div>
                        </div>

                        <button
                            onClick={() => setShowShareModal(false)}
                            style={{
                                width: '100%',
                                marginTop: '24px',
                                padding: '14px',
                                border: '1px solid #e5e5e5',
                                background: 'transparent',
                                borderRadius: '10px',
                                cursor: 'pointer'
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
