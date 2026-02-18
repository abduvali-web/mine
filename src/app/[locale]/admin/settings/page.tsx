import { prisma } from '@/lib/prisma'
import SettingsForm from './SettingsForm'
import styles from './settings.module.css'

export default async function AdminSettingsPage() {
    const settings = await prisma.settings.findUnique({
        where: { id: 'main' }
    })

    // Default object if nothing in DB
    const defaultSettings = {
        storeName: 'SUN KISSED YOU',
        storeEmail: 'contact@shineshop.com',
        currency: '£',
        shippingFee: 5.0,
        freeShipMin: 100.0,
        heroTitle: 'SUN KISSED YOU',
        heroSubtitle: '18K Gold Plated Jewellery',
        footerText: '© 2024 SUN KISSED YOU. All rights reserved.'
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Store Settings</h1>
                <p style={{ margin: 0, color: '#888' }}>Configure your store details and preferences</p>
            </header>

            <SettingsForm initialSettings={settings || defaultSettings as any} />
        </div>
    )
}
