'use client'

import { useState } from 'react'
import Messenger from './Messenger'
import CommunityShowcase from './CommunityShowcase'
import styles from './Community.module.css'

export default function CommunityView() {
    const [activeTab, setActiveTab] = useState<'chats' | 'showcase'>('chats')

    return (
        <div className={styles.container}>
            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'chats' ? styles.active : ''}`}
                    onClick={() => setActiveTab('chats')}
                >
                    💬 Chats
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'showcase' ? styles.active : ''}`}
                    onClick={() => setActiveTab('showcase')}
                >
                    ✨ Community Designs
                </button>
            </div>

            <div className={styles.content}>
                {activeTab === 'chats' ? (
                    <Messenger />
                ) : (
                    <CommunityShowcase />
                )}
            </div>
        </div>
    )
}
