'use client'

import Link from 'next/link'

export default function NotFound() {
    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#fff',
            fontFamily: "'Playfair Display', serif",
            textAlign: 'center',
            padding: '20px'
        }}>
            <h1 style={{ fontSize: '4rem', margin: 0, color: '#0a0a0a' }}>404</h1>
            <p style={{ fontSize: '1.2rem', color: '#888', margin: '20px 0 40px' }}>
                The page you are looking for does not exist.
            </p>
            <Link
                href="/"
                style={{
                    padding: '16px 32px',
                    background: '#0a0a0a',
                    color: '#fff',
                    textDecoration: 'none',
                    textTransform: 'uppercase',
                    fontSize: '0.9rem',
                    letterSpacing: '2px',
                    borderRadius: '4px'
                }}
            >
                Return Home
            </Link>
        </div>
    )
}
