'use client'

import { useState, useEffect, useCallback } from 'react'
import styles from '../jewelry-builder.module.css'

interface User {
    id: string
    name: string | null
    email: string | null
    createdAt: string
    coinBalance: number
    _count: {
        orders: number
        customDesigns: number
        ownedChats: number
    }
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)

    const fetchUsers = useCallback(async () => {
        try {
            const res = await fetch('/api/admin/users')
            const data = await res.json()
            setUsers(data)
        } catch (error) {
            console.error('Error fetching users:', error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner} />
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Users</h1>
                    <p className={styles.subtitle}>Manage customer accounts</p>
                </div>
            </div>

            <div className={styles.card} style={{ padding: 0, overflow: 'hidden' }}>
                <table className={styles.table} style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#f9f9f9', borderBottom: '1px solid #eee' }}>
                        <tr>
                            <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#666' }}>User</th>
                            <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#666' }}>Coins</th>
                            <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#666' }}>Orders</th>
                            <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#666' }}>Designs</th>
                            <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#666' }}>Joined</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                <td style={{ padding: '16px' }}>
                                    <div style={{ fontWeight: '500' }}>{user.name || 'Anonymous'}</div>
                                    <div style={{ fontSize: '0.85rem', color: '#888' }}>{user.email}</div>
                                </td>
                                <td style={{ padding: '16px', fontWeight: '500', color: '#c9a962' }}>
                                    {user.coinBalance.toFixed(2)}
                                </td>
                                <td style={{ padding: '16px' }}>{user._count.orders}</td>
                                <td style={{ padding: '16px' }}>{user._count.customDesigns}</td>
                                <td style={{ padding: '16px', color: '#888' }}>
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
