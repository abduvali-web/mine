'use client'

import { useState, useEffect } from 'react'
import styles from './Header.module.css'
import { Link, usePathname, useRouter } from '@/navigation'
import { useTranslations, useLocale } from 'next-intl'

interface Category {
    id: string
    name: string
    slug: string
}

interface HeaderProps {
    categories: Category[]
}

// Elegant SVG Icons
const UserIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
)

const SearchIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
    </svg>
)

const CartIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
)

const MenuIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
)

const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
)

const GlobeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
)

export default function Header({ categories }: HeaderProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [langOpen, setLangOpen] = useState(false)
    const t = useTranslations('Header')
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navItems = [
        { label: 'HOME', href: '/' },
        { label: 'SHOP', href: '/shop' },
        {
            label: 'BUILD YOUR OWN',
            href: '/build-your-own',
            dropdown: [
                { label: 'CHAINS', href: '/build-your-own?step=1' },
                {
                    label: 'CHARMS',
                    href: '/build-your-own?step=2',
                    submenu: [
                        { label: 'All Charms', href: '/build-your-own?step=2' },
                        { label: 'Gold Charms', href: '/build-your-own?step=2&category=gold' },
                        { label: 'Colourful Charms', href: '/build-your-own?step=2&category=colourful' },
                        { label: 'Silver Charms', href: '/build-your-own?step=2&category=silver' },
                        { label: 'Other Charms', href: '/build-your-own?step=2&category=other' },
                    ]
                }
            ]
        },
        { label: 'PERSONALISED JEWELLERY', href: '/shop/personalised-jewellery' },
        { label: 'NEW ARRIVALS', href: '/shop/new-arrivals' },
        { label: 'COMMUNITY', href: '/community' },
        { label: 'CONTACT US', href: '/pages/contact' },
    ]

    const languages = [
        { code: 'en', label: 'English' },
        { code: 'ru', label: 'Русский' },
        { code: 'uz', label: 'O\'zbek' },
    ]

    const handleLanguageChange = (newLocale: string) => {
        router.replace(pathname, { locale: newLocale })
        setLangOpen(false)
    }

    return (
        <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
            {/* Announcement Bar */}
            <div className={styles.announcement}>
                <p>
                    <span className={styles.sparkle}>✦</span>
                    Complimentary Shipping on Orders Over £100
                    <span className={styles.sparkle}>✦</span>
                </p>
            </div>

            {/* Main Navigation */}
            <nav className={styles.nav}>
                {/* Mobile Menu Button */}
                <button
                    className={styles.menuBtn}
                    onClick={() => setMobileMenuOpen(true)}
                    aria-label="Open menu"
                >
                    <MenuIcon />
                </button>

                {/* Logo */}
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoText}>SUN KISSED YOU</span>
                    <span className={styles.logoSubtext}>FINE JEWELLERY</span>
                </Link>

                {/* Desktop Navigation */}
                <div className={styles.navLinks}>
                    {navItems.map((item) => (
                        <div key={item.label} className={styles.navItem}>
                            <Link href={item.href} className={styles.navLink}>
                                {item.label}
                            </Link>
                            {/* Nested Dropdown */}
                            {item.dropdown && (
                                <div className={styles.megaMenu}>
                                    {item.dropdown.map((sub: any) => (
                                        <div key={sub.label} className={styles.dropdownWrapper}>
                                            <Link href={sub.href} className={styles.dropdownItem}>
                                                {sub.label}
                                                {sub.submenu && <span className={styles.arrow}>›</span>}
                                            </Link>
                                            {sub.submenu && (
                                                <div className={styles.submenu}>
                                                    {sub.submenu.map((nested: any) => (
                                                        <Link key={nested.label} href={nested.href} className={styles.dropdownItem}>
                                                            {nested.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className={styles.actions}>
                    {/* Language Selector */}
                    <div className={styles.langSelector}>
                        <button
                            className={styles.langBtn}
                            onClick={() => setLangOpen(!langOpen)}
                            aria-label="Select language"
                        >
                            <GlobeIcon />
                            <span>{locale.toUpperCase()}</span>
                        </button>
                        {langOpen && (
                            <div className={styles.langDropdown}>
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => handleLanguageChange(lang.code)}
                                        className={styles.langOption}
                                    >
                                        {lang.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <Link href="/account" className={styles.actionBtn} aria-label="Account">
                        <UserIcon />
                    </Link>
                    <Link href="/search" className={styles.actionBtn} aria-label="Search">
                        <SearchIcon />
                    </Link>
                    <Link href="/cart" className={styles.actionBtn} aria-label="Shopping bag">
                        <CartIcon />
                        <span className={styles.cartBadge}>2</span>
                    </Link>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.open : ''}`}>
                <button
                    className={styles.mobileClose}
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close menu"
                >
                    <CloseIcon />
                </button>

                <div className={styles.mobileLinks}>
                    {navItems.map((item, index) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={styles.mobileLink}
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                <div className={styles.mobileActions}>
                    <Link href="/account" className={styles.mobileActionBtn} onClick={() => setMobileMenuOpen(false)}>
                        <UserIcon />
                        <span>Account</span>
                    </Link>
                    <div className={styles.mobileActionBtn}>
                        <GlobeIcon />
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => handleLanguageChange(lang.code)}
                                    style={{
                                        fontWeight: locale === lang.code ? 'bold' : 'normal',
                                        color: locale === lang.code ? 'var(--color-gold)' : 'inherit'
                                    }}
                                >
                                    {lang.code.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
