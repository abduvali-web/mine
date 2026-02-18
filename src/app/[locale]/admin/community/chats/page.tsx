'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import styles from '../../jewelry-builder.module.css'

interface Chat {
    id: string
    type: string
    name: string | null
    username: string | null
    description: string | null
    image: string | null
    isPublic: boolean
    createdAt: string
    owner: {
        name: string | null
        email: string
    } | null
    _count: {
        members: number
        messages: number
    }
}

export default function AdminChatsPage() {
    const [chats, setChats] = useState<Chat[]>([])
    const [loading, setLoading] = useState(true)

    const fetchChats = useCallback(async () => {
        try {
            const res = await fetch('/api/admin/chats')
            const data = await res.json()
            setChats(data)
        } catch (error) {
            console.error('Error fetching chats:', error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchChats()
    }, [fetchChats])

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
                    <h1 className={styles.title}>Community Chats</h1>
                    <p className={styles.subtitle}>Manage groups and channels</p>
                </div>
            </div>

            <div className={styles.card} style={{ padding: 0, overflow: 'hidden' }}>
                <table className={styles.table} style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#f9f9f9', borderBottom: '1px solid #eee' }}>
                        <tr>
                            <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#666' }}>Name</th>
                            <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#666' }}>Type</th>
                            <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#666' }}>Members</th>
                            <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#666' }}>Messages</th>
                            <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#666' }}>Created</th>
                        </tr>
                    </thead>
                    <tbody>
                        {chats.map(chat => (
                            <tr key={chat.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                <td style={{ padding: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        {chat.image ? (
                                            <Image src={chat.image} alt="" width={40} height={40} style={{ borderRadius: '50%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {chat.name?.[0] || '?'}
                                            </div>
                                        )}
                                        <div>
                                            <div style={{ fontWeight: '500' }}>{chat.name || 'Direct Message'}</div>
                                            {chat.username && <div style={{ fontSize: '0.8rem', color: '#888' }}>@{chat.username}</div>}
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '16px' }}>
                                    <span className={styles.badge} style={{ textTransform: 'uppercase' }}>
                                        {chat.type}
                                    </span>
                                </td>
                                <td style={{ padding: '16px' }}>{chat._count.members}</td>
                                <td style={{ padding: '16px' }}>{chat._count.messages}</td>
                                <td style={{ padding: '16px', color: '#888' }}>
                                    {new Date(chat.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
