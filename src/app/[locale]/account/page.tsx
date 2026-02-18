import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Link } from '@/navigation'
import Header from '@/components/store/Header'
import Footer from '@/components/store/Footer'
import LogoutButton from '@/components/store/LogoutButton'
import styles from './Account.module.css'

export const metadata = {
    title: 'My Account | Sun Kissed You',
}

export default async function AccountPage() {
    let session = null
    try {
        session = await getServerSession(authOptions)
    } catch (error) {
        console.error('Session error:', error)
        redirect('/account/login')
    }

    if (!session) {
        redirect('/account/login')
    }

    const categories = await prisma.category.findMany({ orderBy: { order: 'asc' } })

    // Fetch orders
    const orders = await prisma.order.findMany({
        where: {
            OR: [
                { userId: session.user.id },
                { customerEmail: session.user.email || undefined }
            ]
        },
        orderBy: { createdAt: 'desc' }
    })

    const role = (session.user as { role?: string }).role

    return (
        <div className={styles.container}>
            <Header categories={categories} />

            <header className={styles.header}>
                <h1>My Account</h1>
                <LogoutButton />
            </header>

            <div className={styles.grid}>
                <section className={styles.profile}>
                    <h2>Details</h2>
                    <div className={styles.card}>
                        <p><strong>Name:</strong> {session.user.name}</p>
                        <p><strong>Email:</strong> {session.user.email}</p>
                        <p><strong>Status:</strong> {role === 'admin' ? 'Admin' : 'Customer'}</p>
                        {role === 'admin' && (
                            <Link href="/admin" className={styles.adminLink}>Go to Admin Panel</Link>
                        )}
                    </div>
                </section>

                <section className={styles.orders}>
                    <h2>Order History</h2>
                    <div className={styles.card}>
                        {orders.length > 0 ? (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid #eee', textAlign: 'left', fontSize: '0.8rem', color: '#888' }}>
                                            <th style={{ padding: '10px' }}>Order</th>
                                            <th style={{ padding: '10px' }}>Date</th>
                                            <th style={{ padding: '10px' }}>Status</th>
                                            <th style={{ padding: '10px' }}>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order) => (
                                            <tr key={order.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                                                <td style={{ padding: '15px 10px', fontSize: '0.9rem' }}>#{order.id.slice(-6).toUpperCase()}</td>
                                                <td style={{ padding: '15px 10px', fontSize: '0.9rem' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                                <td style={{ padding: '15px 10px', fontSize: '0.9rem' }}>
                                                    <span style={{
                                                        padding: '4px 10px',
                                                        borderRadius: '20px',
                                                        background: '#fcfcfc',
                                                        border: '1px solid #eee',
                                                        fontSize: '0.75rem',
                                                        textTransform: 'uppercase'
                                                    }}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '15px 10px', fontSize: '0.9rem', fontWeight: '600' }}>£{order.total.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className={styles.empty}>
                                <p>You haven't placed any orders yet.</p>
                                <Link href="/shop" className={styles.shopNow}>Start Shopping</Link>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            <Footer />
        </div>
    )
}
