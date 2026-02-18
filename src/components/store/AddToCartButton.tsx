'use client'

import { useState } from 'react'
import styles from './AddToCartButton.module.css'

interface Product {
    id: string
    name: string
    price: number
}

interface AddToCartButtonProps {
    product: Product
    enablePersonalization?: boolean
}

export default function AddToCartButton({ product, enablePersonalization = false }: AddToCartButtonProps) {
    const [added, setAdded] = useState(false)
    const [quantity, setQuantity] = useState(1)
    const [personalizationText, setPersonalizationText] = useState('')
    const MAX_CHARS = 20

    const handleAddToCart = () => {
        // Get current cart from localStorage
        const cartJson = localStorage.getItem('cart')
        const cart = cartJson ? JSON.parse(cartJson) : []

        // Generate unique ID based on product + personalization
        // This allows adding same product with different names separately
        const uniqueId = enablePersonalization && personalizationText
            ? `${product.id}-${personalizationText}`
            : product.id

        // Check if exact item already in cart
        const existingIndex = cart.findIndex((item: any) => item.uniqueId === uniqueId)

        if (existingIndex >= 0) {
            cart[existingIndex].quantity += quantity
        } else {
            cart.push({
                uniqueId: uniqueId, // internal tracking
                id: product.id,
                name: product.name,
                price: product.price,
                quantity,
                personalization: personalizationText || undefined
            })
        }

        localStorage.setItem('cart', JSON.stringify(cart))

        // Brief success state
        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
    }

    return (
        <div className={styles.wrapper}>
            {enablePersonalization && (
                <div className={styles.personalization}>
                    <label className={styles.label}>
                        Personalization (Optional)
                    </label>
                    <input
                        type="text"
                        className={styles.textInput}
                        placeholder="Enter name or initial..."
                        value={personalizationText}
                        onChange={(e) => setPersonalizationText(e.target.value.slice(0, MAX_CHARS))}
                    />
                    <span className={styles.charsRemaining}>
                        {personalizationText.length}/{MAX_CHARS} characters
                    </span>
                </div>
            )}

            <div className={styles.quantity}>
                <span className={styles.label}>Quantity</span>
                <div className={styles.qtySelector}>
                    <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className={styles.qtyBtn}
                    >
                        -
                    </button>
                    <span className={styles.qtyValue}>{quantity}</span>
                    <button
                        onClick={() => setQuantity(quantity + 1)}
                        className={styles.qtyBtn}
                    >
                        +
                    </button>
                </div>
            </div>

            <button
                onClick={handleAddToCart}
                disabled={added}
                className={`${styles.addBtn} ${added ? styles.success : ''}`}
            >
                {added ? (
                    <>
                        <span>✓</span> Added to Cart
                    </>
                ) : (
                    <>
                        Add to Cart
                    </>
                )}
            </button>
        </div>
    )
}
