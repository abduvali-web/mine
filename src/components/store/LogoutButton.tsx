'use client'

import { signOut } from 'next-auth/react'
import styles from '@/app/[locale]/account/Account.module.css'

export default function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className={styles.logoutBtn}
        >
            Logout
        </button>
    )
}
