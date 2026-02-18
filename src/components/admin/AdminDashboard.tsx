'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './AdminDashboard.module.css'

interface AdminDashboardProps {
    stats: {
        products: number
        orders: number
        categories: number
        revenue: number
    }
    recentOrders: {
        id: string
        customerName: string
        total: number
        status: string
        createdAt: string | Date
    }[]
}

export default function AdminDashboard({ stats, recentOrders }: AdminDashboardProps) {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === 'unauthenticated' || (session?.user as { role?: string })?.role !== 'admin') {
            router.push('/account/login')
        }
    }, [session, status, router])

    if (status === 'loading' || (session?.user as { role?: string })?.role !== 'admin') {
        return <div className={styles.loading}>Checking permissions...</div>
    }

    return (
        <div>
            <header className={styles.header}>
                <h1>Welcome back, {session?.user?.name}</h1>
                <p>Here's what's happening with your store today.</p>
            </header>

            <section className={styles.stats}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>📦</div>
                    <div className={styles.statInfo}>
                        <span className={styles.statValue}>{stats.products}</span>
                        <span className={styles.statLabel}>Total Products</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>🛒</div>
                    <div className={styles.statInfo}>
                        <span className={styles.statValue}>{stats.orders}</span>
                        <span className={styles.statLabel}>Total Orders</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>📁</div>
                    <div className={styles.statInfo}>
                        <span className={styles.statValue}>{stats.categories}</span>
                        <span className={styles.statLabel}>Categories</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>💰</div>
                    <div className={styles.statInfo}>
                        <span className={styles.statValue}>£{stats.revenue.toFixed(2)}</span>
                        <span className={styles.statLabel}>Total Revenue</span>
                    </div>
                </div>
            </section>

            <section className={styles.recentOrders}>
                <div className={styles.sectionHeader}>
                    <h2>Recent Orders</h2>
                    <Link href="/admin/orders">View All Orders →</Link>
                </div>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.length > 0 ? recentOrders.map((order) => (
                                <tr key={order.id}>
                                    <td className={styles.orderId}>#{order.id.slice(-6).toUpperCase()}</td>
                                    <td>{order.customerName}</td>
                                    <td>£{order.total.toFixed(2)}</td>
                                    <td>
                                        <span className={`${styles.status} ${styles[order.status]}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className={styles.empty}>No orders found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className={styles.quickActions}>
                <h2>Quick Actions</h2>
                <div className={styles.actionGrid}>
                    <Link href="/admin/products/new" className={styles.actionCard}>
                        <span className={styles.actionIcon}>➕</span>
                        Add New Product
                    </Link>
                    <Link href="/admin/categories" className={styles.actionCard}>
                        <span className={styles.actionIcon}>📂</span>
                        Manage Categories
                    </Link>
                    <Link href="/admin/orders" className={styles.actionCard}>
                        <span className={styles.actionIcon}>📦</span>
                        Manage Orders
                    </Link>
                </div>
            </section>
        </div>
    )
}
