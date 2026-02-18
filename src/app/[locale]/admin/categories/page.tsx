import { prisma } from '@/lib/prisma'
import { Link } from '@/navigation'
import styles from './categories.module.css'

export default async function AdminCategoriesPage() {
    const categories = await prisma.category.findMany({
        orderBy: { order: 'asc' },
        include: { _count: { select: { products: true } } }
    })

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1>Categories</h1>
                    <p style={{ margin: 0, color: '#888' }}>Organize your products ({categories.length})</p>
                </div>
                <Link href="/admin/categories/new" className={styles.addBtn}>
                    + Add Category
                </Link>
            </header>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Order</th>
                            <th>Name</th>
                            <th>Slug</th>
                            <th>Products</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((cat) => (
                            <tr key={cat.id}>
                                <td>{cat.order}</td>
                                <td style={{ fontWeight: 600 }}>{cat.name}</td>
                                <td style={{ color: '#888', fontFamily: 'monospace' }}>{cat.slug}</td>
                                <td>{cat._count.products}</td>
                                <td>
                                    <div className={styles.actions}>
                                        <button className={styles.editBtn}>Edit</button>
                                        <button className={styles.deleteBtn}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && (
                            <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px' }}>No categories found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
