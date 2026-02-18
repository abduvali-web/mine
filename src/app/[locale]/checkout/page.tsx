'use client'

import { useState } from 'react'
import { Link } from '@/navigation'
import styles from './checkout.module.css'

export default function CheckoutPage() {
    const [isProcessing, setIsProcessing] = useState(false)

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault()
        setIsProcessing(true)
        // Simulate payment processing
        setTimeout(() => {
            setIsProcessing(false)
            alert('Order placed successfully! (Demo)')
        }, 2000)
    }

    return (
        <div className={styles.main}>
            <div className={styles.container}>
                <h1 className={styles.title}>Secure Checkout</h1>

                <form onSubmit={handlePayment} className={styles.grid}>
                    {/* Shipping Form */}
                    <div className={styles.formSection}>
                        <h2 className={styles.sectionTitle}>Shipping Address</h2>
                        <div className={styles.formGrid}>
                            <div className={styles.field}>
                                <label className={styles.label}>First Name</label>
                                <input type="text" className={styles.input} required />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label}>Last Name</label>
                                <input type="text" className={styles.input} required />
                            </div>
                            <div className={`${styles.field} ${styles.fullWidth}`}>
                                <label className={styles.label}>Address</label>
                                <input type="text" className={styles.input} required />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label}>City</label>
                                <input type="text" className={styles.input} required />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label}>Postal Code</label>
                                <input type="text" className={styles.input} required />
                            </div>
                        </div>

                        <h2 className={styles.sectionTitle} style={{ marginTop: '40px' }}>Payment Details</h2>
                        <div className={styles.field}>
                            <label className={styles.label}>Card Number</label>
                            <input type="text" placeholder="0000 0000 0000 0000" className={styles.input} required />
                        </div>
                        <div className={styles.formGrid}>
                            <div className={styles.field}>
                                <label className={styles.label}>Expiry</label>
                                <input type="text" placeholder="MM/YY" className={styles.input} required />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label}>CVC</label>
                                <input type="text" placeholder="123" className={styles.input} required />
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className={styles.summary}>
                        <h2 className={styles.sectionTitle}>Order Summary</h2>
                        <div className={styles.summaryRow}>
                            <span>Subtotal</span>
                            <span>£120.00</span>
                        </div>
                        <div className={styles.summaryRow}>
                            <span>Shipping</span>
                            <span style={{ color: '#16a34a' }}>Free</span>
                        </div>
                        <div className={styles.totalRow}>
                            <span>Total</span>
                            <span>£120.00</span>
                        </div>

                        <button type="submit" className={styles.payBtn} disabled={isProcessing}>
                            {isProcessing ? 'Processing...' : 'Pay Now'}
                        </button>

                        <div className={styles.trustBadges}>
                            <span>🔒 SSL Secure Payment</span>
                            <span>🛡️ Money Back Guarantee</span>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
