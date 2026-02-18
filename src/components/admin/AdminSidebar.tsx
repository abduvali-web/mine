'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import styles from './AdminLayout.module.css'
import { signOut } from 'next-auth/react'

export default function AdminSidebar() {
    const pathname = usePathname()

    const navItems = [
        { label: 'Overview', icon: '📊', href: '/admin', exact: true },
        { label: 'Products', icon: '📦', href: '/admin/products', exact: false },
        { label: 'Categories', icon: '📁', href: '/admin/categories', exact: false },
        { label: 'Orders', icon: '🛒', href: '/admin/orders', exact: false },
        { label: 'Settings', icon: '⚙️', href: '/admin/settings', exact: false },
    ]

    const builderItems = [
        { label: 'Jewelry Types', icon: '💎', href: '/admin/jewelry-types', exact: false },
        { label: 'Jewelry Items', icon: '📿', href: '/admin/jewelry-items', exact: false },
        { label: 'Charms', icon: '✨', href: '/admin/charms', exact: false },
    ]

    const communityItems = [
        { label: 'Custom Designs', icon: '🎨', href: '/admin/custom-designs', exact: false },
        { label: 'Chats', icon: '💬', href: '/admin/community/chats', exact: false },
        { label: 'Users', icon: '👥', href: '/admin/users', exact: false },
    ]

    const isActive = (href: string, exact: boolean) => {
        if (exact) return pathname === href || pathname.endsWith(href)
        return pathname.includes(href)
    }

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <span className={styles.logoIcon}>✦</span>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span>SUN KISSED YOU</span>
                    <span style={{ fontSize: '0.6rem', color: '#c9a962', letterSpacing: '2px' }}>ADMIN PANEL</span>
                </div>
            </div>

            <nav className={styles.nav}>
                {/* Main Navigation */}
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`${styles.navItem} ${isActive(item.href, item.exact) ? styles.active : ''}`}
                    >
                        <span className={styles.navIcon}>{item.icon}</span>
                        <span>{item.label}</span>
                    </Link>
                ))}

                {/* Jewelry Builder Section */}
                <div className={styles.navSection}>
                    <span className={styles.navSectionTitle}>JEWELRY BUILDER</span>
                </div>
                {builderItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`${styles.navItem} ${isActive(item.href, item.exact) ? styles.active : ''}`}
                    >
                        <span className={styles.navIcon}>{item.icon}</span>
                        <span>{item.label}</span>
                    </Link>
                ))}

                {/* Community Section */}
                <div className={styles.navSection}>
                    <span className={styles.navSectionTitle}>COMMUNITY</span>
                </div>
                {communityItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`${styles.navItem} ${isActive(item.href, item.exact) ? styles.active : ''}`}
                    >
                        <span className={styles.navIcon}>{item.icon}</span>
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className={styles.sidebarFooter}>
                <Link href="/" className={styles.viewStore} target="_blank">
                    <span>👁️</span>
                    <span>View Store</span>
                </Link>
                <button onClick={() => signOut()} className={styles.logout}>
                    Sign Out
                </button>
            </div>
        </aside>
    )
}
