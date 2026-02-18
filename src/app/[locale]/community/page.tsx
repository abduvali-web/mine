import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import CommunityView from '@/components/store/CommunityView'
import Header from '@/components/store/Header'
import { prisma } from '@/lib/prisma'

export const metadata = {
    title: 'Community | Sun Kissed You',
    description: 'Join our community of jewelry lovers.',
}

export default async function CommunityPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/account/login?callbackUrl=/community')
    }

    const categories = await prisma.category.findMany({ orderBy: { order: 'asc' } })

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8f6f3' }}>
            <Header categories={categories} />
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <CommunityView />
            </main>
        </div>
    )
}
