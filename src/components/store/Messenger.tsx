'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import styles from './Messenger.module.css'
import Image from 'next/image'

interface Chat {
    id: string
    type: string
    name?: string
    image?: string
    lastMessage?: {
        content: string
        createdAt: string
    }
    unreadCount: number
    members: any[]
}

interface Message {
    id: string
    content: string
    senderId: string
    sender: {
        name: string
        username: string
        email: string
        avatar?: string
    }
    createdAt: string
    type: string
}

export default function Messenger() {
    const { data: session } = useSession()
    const [chats, setChats] = useState<Chat[]>([])
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [showNewChatModal, setShowNewChatModal] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<{ users: any[], groups: any[] }>({ users: [], groups: [] })

    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Fetch chats
    const fetchChats = async () => {
        try {
            const res = await fetch('/api/community/chats')
            if (res.ok) {
                const data = await res.json()
                setChats(data)
            }
        } catch (error) {
            console.error('Failed to fetch chats', error)
        }
    }

    useEffect(() => {
        if (session?.user) {
            fetchChats()
            const interval = setInterval(fetchChats, 10000) // Poll every 10s
            return () => clearInterval(interval)
        }
    }, [session])

    // Fetch messages for selected chat
    const fetchMessages = async (chatId: string) => {
        try {
            const res = await fetch(`/api/community/chats/${chatId}/messages?limit=50`)
            if (res.ok) {
                const data = await res.json()
                setMessages(data.messages)
            }
        } catch (error) {
            console.error('Failed to fetch messages', error)
        }
    }

    useEffect(() => {
        if (selectedChat) {
            fetchMessages(selectedChat.id)
            const interval = setInterval(() => fetchMessages(selectedChat.id), 3000) // Poll active chat faster
            return () => clearInterval(interval)
        }
    }, [selectedChat])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault()
        if (!newMessage.trim() || !selectedChat) return

        try {
            const res = await fetch(`/api/community/chats/${selectedChat.id}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newMessage })
            })

            if (res.ok) {
                setNewMessage('')
                fetchMessages(selectedChat.id) // Refresh immediately
                fetchChats() // Update last message in sidebar
            }
        } catch (error) {
            console.error('Failed to send message', error)
        }
    }

    const handleSearch = async (query: string) => {
        setSearchQuery(query)
        if (query.length < 2) {
            setSearchResults({ users: [], groups: [] })
            return
        }

        try {
            const res = await fetch(`/api/community/search?q=${encodeURIComponent(query)}`)
            if (res.ok) {
                const data = await res.json()
                setSearchResults(data)
            }
        } catch (error) {
            console.error('Search failed', error)
        }
    }

    const startChat = async (recipientId: string) => {
        try {
            const res = await fetch('/api/community/chats', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'direct', recipientId })
            })

            if (res.ok) {
                const chat = await res.json()
                setShowNewChatModal(false)
                fetchChats()
                setSelectedChat(chat) // Select the new chat
            }
        } catch (error) {
            console.error('Failed to start chat', error)
        }
    }

    const getChatName = (chat: Chat) => {
        if (chat.type === 'group') return chat.name
        // For direct, find the other user
        const otherMember = chat.members.find(m => m.user.email !== session?.user?.email)
        return otherMember?.user.name || 'Unknown User'
    }

    const getChatAvatar = (chat: Chat) => {
        // Simple avatar logic
        const name = getChatName(chat) || '?'
        return name.charAt(0).toUpperCase()
    }

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <h2 className={styles.sidebarTitle}>Messages</h2>
                    <button className={styles.newChatBtn} onClick={() => setShowNewChatModal(true)}>+</button>
                </div>
                <div className={styles.chatList}>
                    {chats.map(chat => (
                        <div
                            key={chat.id}
                            className={`${styles.chatItem} ${selectedChat?.id === chat.id ? styles.active : ''}`}
                            onClick={() => setSelectedChat(chat)}
                        >
                            <div className={styles.avatar}>{getChatAvatar(chat)}</div>
                            <div className={styles.chatInfo}>
                                <div className={styles.chatName}>{getChatName(chat)}</div>
                                <div className={styles.lastMessage}>{chat.lastMessage?.content || 'No messages yet'}</div>
                            </div>
                            <div className={styles.meta}>
                                {chat.unreadCount > 0 && <span className={styles.unreadBadge}>{chat.unreadCount}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.chatArea}>
                {selectedChat ? (
                    <>
                        <div className={styles.chatHeader}>
                            <h3 className={styles.chatHeaderName}>{getChatName(selectedChat)}</h3>
                        </div>
                        <div className={styles.messagesList}>
                            {messages.map(msg => {
                                const isMe = msg.sender.email === session?.user?.email
                                return (
                                    <div key={msg.id} className={`${styles.messageRow} ${isMe ? styles.own : styles.other}`}>
                                        {!isMe && <div className={styles.avatar} style={{ width: 30, height: 30, fontSize: '0.8rem', marginRight: 5 }}>{msg.sender.name[0]}</div>}
                                        <div>
                                            {/* !isMe && <div className={styles.senderName}>{msg.sender.name}</div> */}
                                            <div className={styles.messageBubble}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                            <div ref={messagesEndRef} />
                        </div>
                        <form className={styles.inputArea} onSubmit={handleSendMessage}>
                            <input
                                className={styles.input}
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                            />
                            <button className={styles.sendBtn} disabled={!newMessage.trim()}>➤</button>
                        </form>
                    </>
                ) : (
                    <div className={styles.emptyState}>
                        <span style={{ fontSize: '3rem' }}>💬</span>
                        <p>Select a chat to start messaging</p>
                    </div>
                )}
            </div>

            {showNewChatModal && (
                <div className={styles.modalOverlay} onClick={() => setShowNewChatModal(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>New Message</h3>
                            <button className={styles.closeBtn} onClick={() => setShowNewChatModal(false)}>×</button>
                        </div>
                        <div style={{ padding: '0 20px' }}>
                            <input
                                className={styles.input}
                                style={{ width: '100%', margin: '15px 0' }}
                                placeholder="Search users (@username)..."
                                value={searchQuery}
                                onChange={e => handleSearch(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <div className={styles.modalBody}>
                            {searchResults.users.map(user => (
                                <div key={user.id} className={styles.searchResult} onClick={() => startChat(user.id)}>
                                    <div className={styles.avatar} style={{ width: 36, height: 36 }}>{user.name[0]}</div>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{user.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#888' }}>@{user.username}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
