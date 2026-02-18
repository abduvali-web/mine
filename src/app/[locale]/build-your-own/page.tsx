'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/store/Header'
import Footer from '@/components/store/Footer'
import InteractiveBuilder from '@/components/store/InteractiveBuilder'
import styles from './build.module.css'

export default function BuildPage() {
    const searchParams = useSearchParams()
    const [started, setStarted] = useState(false)

    useEffect(() => {
        if (searchParams?.get('step') || searchParams?.get('design')) {
            setStarted(true)
        }
    }, [searchParams])

    return (
        <div className={styles.main}>
            <Header categories={[]} />

            {!started ? (
                <>
                    <section className={styles.hero} style={{ backgroundImage: 'url(/build-your-own.png)' }}>
                        <div className={styles.heroOverlay} />
                        <div className={styles.heroContent}>
                            <span className={styles.heroLabel}>CREATE YOUR OWN</span>
                            <h1 className={styles.heroTitle}>Design Your Dream Jewelry</h1>
                            <p className={styles.heroSubtitle}>
                                Choose your chain, place your favorite charms, and create a unique piece that tells your story.
                                Share your design with friends and earn 5% when they purchase!
                            </p>
                            <button onClick={() => setStarted(true)} className={styles.startBtn}>
                                Start Designing ✨
                            </button>
                        </div>
                    </section>

                    <section className={styles.features}>
                        <div className={styles.featuresContainer}>
                            <div className={styles.featureCard}>
                                <div className={styles.featureIcon}>📿</div>
                                <h3>Select Your Chain</h3>
                                <p>Choose from our collection of premium 18K gold plated or sterling silver chains in various lengths.</p>
                            </div>
                            <div className={styles.featureCard}>
                                <div className={styles.featureIcon}>✨</div>
                                <h3>Place Your Charms</h3>
                                <p>Pick from dozens of beautiful charms and place them in up to 12 positions - front or back of your chain.</p>
                            </div>
                            <div className={styles.featureCard}>
                                <div className={styles.featureIcon}>🔗</div>
                                <h3>Share & Earn</h3>
                                <p>Share your unique design with friends. When someone buys your design, you earn 5% in discount coins!</p>
                            </div>
                        </div>
                    </section>

                    <section className={styles.howItWorks}>
                        <div className={styles.howContainer}>
                            <h2>How It Works</h2>
                            <div className={styles.stepsGrid}>
                                <div className={styles.stepCard}>
                                    <span className={styles.stepNumber}>01</span>
                                    <h3>Choose Your Base</h3>
                                    <p>Start by selecting a chain in your preferred length and material - gold, silver, or rose gold.</p>
                                </div>
                                <div className={styles.stepCard}>
                                    <span className={styles.stepNumber}>02</span>
                                    <h3>Add Charms</h3>
                                    <p>Browse our charm collection and click to place them on your chain. Toggle between front and back views.</p>
                                </div>
                                <div className={styles.stepCard}>
                                    <span className={styles.stepNumber}>03</span>
                                    <h3>Tag & Share</h3>
                                    <p>Add tags to your design so others can discover it. Share with friends or the community!</p>
                                </div>
                                <div className={styles.stepCard}>
                                    <span className={styles.stepNumber}>04</span>
                                    <h3>Get Rewards</h3>
                                    <p>Earn 5% in discount coins every time someone purchases your shared design!</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </>
            ) : (
                <div className={styles.builderWrapper}>
                    <InteractiveBuilder />
                </div>
            )}

            <Footer />
        </div>
    )
}
