import { prisma } from '@/lib/prisma'
import { Link } from '@/navigation'
import styles from './orders.module.css'

export default async function AdminOrdersPage() {
    const orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: { user: true }
    })

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1>Orders</h1>
                    <p>Manage store orders and shipments</p>
                </div>
            </header>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Email</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Total</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? orders.map((order) => (
                            <tr key={order.id}>
                                <td className={styles.orderId}>#{order.id.slice(-6).toUpperCase()}</td>
                                <td>{order.customerName}</td>
                                <td>{order.customerEmail}</td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <span className={`${styles.status} ${styles[order.status]}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td>£{order.total.toFixed(2)}</td>
                                <td>
                                    <div className={styles.actions}>
                                        <Link href={`/admin/orders/${order.id}`} className={styles.actionBtn}>
                                            View Details
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={7} className={styles.empty}>No orders found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
