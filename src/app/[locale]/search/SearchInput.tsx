'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import styles from './search.module.css'

export default function SearchInput() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [query, setQuery] = useState(searchParams.get('q') || '')
    const [isPending, startTransition] = useTransition()

    const handleSearch = (term: string) => {
        setQuery(term)
        startTransition(() => {
            if (term) {
                router.replace(`/search?q=${encodeURIComponent(term)}`)
            } else {
                router.replace('/search')
            }
        })
    }

    return (
        <div className={styles.searchWrapper}>
            <input
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search for jewellery..."
                className={styles.input}
                autoFocus
            />
            <div className={styles.searchIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
            </div>
        </div>
    )
}
