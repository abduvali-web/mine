import styles from './Footer.module.css'
import { Link } from '@/navigation'
import { useTranslations } from 'next-intl'

// Elegant SVG Icons
const InstagramIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
)

const TikTokIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
)

const ArrowIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
)

export default function Footer() {
    const t = useTranslations('Footer')
    const h = useTranslations('Header')

    const footerLinks = [
        { label: h('home'), href: '/' },
        { label: h('shop'), href: '/shop' },
        { label: h('buildYourOwn'), href: '/build-your-own' },
        { label: h('personalisedJewellery'), href: '/shop/personalised-jewellery' },
        { label: h('newArrivals'), href: '/shop/new-arrivals' },
        { label: h('contact'), href: '/pages/contact' },
    ]

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                {/* Main Footer Grid */}
                <div className={styles.grid}>
                    {/* Brand Column */}
                    <div className={styles.brand}>
                        <div className={styles.logoWrapper}>
                            <span className={styles.logoText}>SUN KISSED YOU</span>
                            <span className={styles.logoSubtext}>FINE JEWELLERY</span>
                        </div>
                        <p className={styles.description}>
                            {t('brandDescription')}
                        </p>
                        <div className={styles.socials}>
                            <a href="#" aria-label="Instagram" className={styles.socialLink}>
                                <InstagramIcon />
                            </a>
                            <a href="#" aria-label="TikTok" className={styles.socialLink}>
                                <TikTokIcon />
                            </a>
                        </div>
                    </div>

                    {/* Navigation Column */}
                    <div className={styles.column}>
                        <h4 className={styles.columnTitle}>{t('navigation')}</h4>
                        <nav className={styles.navLinks}>
                            {footerLinks.map(link => (
                                <Link key={link.label} href={link.href} className={styles.navLink}>
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Customer Care Column */}
                    <div className={styles.column}>
                        <h4 className={styles.columnTitle}>{t('customerCare')}</h4>
                        <nav className={styles.navLinks}>
                            <Link href="/pages/faqs" className={styles.navLink}>{t('faqs')}</Link>
                            <Link href="/pages/shipping" className={styles.navLink}>{t('shipping')}</Link>
                            <Link href="/pages/contact" className={styles.navLink}>{t('contact')}</Link>
                            <Link href="/pages/about" className={styles.navLink}>{t('about')}</Link>
                        </nav>
                    </div>

                    {/* Newsletter Column */}
                    <div className={styles.column}>
                        <h4 className={styles.columnTitle}>{t('newsletter')}</h4>
                        <p className={styles.newsletterText}>{t('newsletterSub')}</p>
                        <form className={styles.newsletter}>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className={styles.input}
                                />
                                <button type="submit" className={styles.submitBtn} aria-label="Subscribe">
                                    <ArrowIcon />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Divider */}
                <div className={styles.divider} />

                {/* Bottom Section */}
                <div className={styles.bottom}>
                    <p className={styles.copyright}>© 2026 SUN KISSED YOU. {t('rights')}</p>
                    <div className={styles.bottomLinks}>
                        <Link href="/pages/privacy" className={styles.bottomLink}>Privacy Policy</Link>
                        <Link href="/pages/terms" className={styles.bottomLink}>Terms of Service</Link>
                    </div>
                </div>
            </div>

            {/* Mobile Icon Bar */}
            <div className={styles.mobileBar}>
                <Link href="/" className={styles.mobileItem}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    <span>HOME</span>
                </Link>
                <Link href="/shop" className={styles.mobileItem}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                        <path d="M3 6h18" />
                        <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                    <span>SHOP</span>
                </Link>
                <Link href="/build-your-own" className={styles.mobileItem}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                    </svg>
                    <span>CREATE</span>
                </Link>
                <Link href="/account" className={styles.mobileItem}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span>ACCOUNT</span>
                </Link>
                <Link href="/cart" className={styles.mobileItem}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="8" cy="21" r="1" />
                        <circle cx="19" cy="21" r="1" />
                        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                    </svg>
                    <span>CART</span>
                </Link>
            </div>
        </footer>
    )
}
