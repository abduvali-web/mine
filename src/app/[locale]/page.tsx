import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Header from '@/components/store/Header'
import Footer from '@/components/store/Footer'
import ProductCard from '@/components/store/ProductCard'
import PopUp from '@/components/store/PopUp'
import styles from './page.module.css'

export default async function HomePage() {
  // Fetch data
  const [categories, products, settings] = await Promise.all([
    prisma.category.findMany({ orderBy: { order: 'asc' } }),
    prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.settings.findFirst()
  ])

  const newArrivals = products.filter(p => p.featured).slice(0, 4)
  const personalised = products.filter(p => p.categoryId === categories.find(c => c.slug === 'necklaces')?.id).slice(0, 4)
  const bestSellers = products.slice(0, 4)

  return (
    <>
      <PopUp />
      <Header categories={categories} />

      <main className={styles.main}>
        {/* Hero Section - Cinematic */}
        <section className={styles.hero}>
          <div className={styles.heroBackground}>
            <div className={styles.heroImage} style={{ backgroundImage: "url('/hero-luxury.png')" }} />
            <div className={styles.heroOverlay} />
          </div>
          <div className={styles.heroContent}>
            <div className={styles.heroTextWrapper}>
              <span className={styles.heroEyebrow}>EXQUISITE CRAFTSMANSHIP</span>
              <h1 className={styles.heroTitle}>
                SUN KISSED YOU
              </h1>

              <div className={styles.heroCta}>
                <Link href="/shop" className={styles.btnPrimary}>
                  EXPLORE COLLECTION
                </Link>
                <Link href="/shop/new-arrivals" className={styles.btnSecondary}>
                  NEW ARRIVALS
                </Link>
              </div>
            </div>
          </div>
          <div className={styles.heroScroll}>
            <span>SCROLL</span>
            <div className={styles.scrollLine} />
          </div>
        </section>

        {/* Featured Collection Banner */}
        <section className={styles.featuredBanner}>
          <div className={styles.bannerContent}>
            <span className={styles.bannerLabel}>FEATURED</span>
            <h2 className={styles.bannerTitle}>The Signature Collection</h2>
            <p className={styles.bannerText}>Discover pieces that define elegance</p>
          </div>
        </section>

        {/* New Arrivals Section */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>DISCOVER</span>
              <h2 className={styles.sectionTitle}>New Arrivals</h2>
              <div className={styles.sectionDivider} />
            </div>
            <div className={styles.productsGrid}>
              {newArrivals.map((product, index) => (
                <div key={product.id} className={styles.productWrapper} style={{ animationDelay: `${index * 0.1}s` }}>
                  <ProductCard
                    {...product}
                    category={product.category}
                  />
                </div>
              ))}
            </div>
            <div className={styles.centerBtn}>
              <Link href="/shop/new-arrivals" className={styles.viewAllBtn}>
                <span>VIEW ALL</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Build Your Own - Split Section */}
        <section className={styles.splitSection}>
          <div className={styles.splitImage}>
            <div className={styles.splitImageInner} style={{ backgroundImage: "url('/build-your-own.png')" }} />
          </div>
          <div className={styles.splitContent}>
            <span className={styles.splitLabel}>PERSONALIZE</span>
            <h2 className={styles.splitTitle}>Create Your Own Unique Piece</h2>
            <p className={styles.splitText}>
              Design a necklace that tells your story. Choose your chain, select your charms, and we&apos;ll craft something extraordinary just for you.
            </p>
            <ol className={styles.steps}>
              <li>
                <span className={styles.stepNumber}>01</span>
                <span>Select your chain in your preferred length and color</span>
              </li>
              <li>
                <span className={styles.stepNumber}>02</span>
                <span>Browse and add your favorite charms</span>
              </li>
              <li>
                <span className={styles.stepNumber}>03</span>
                <span>We&apos;ll arrange them beautifully for you</span>
              </li>
            </ol>
            <Link href="/build-your-own" className={styles.btnPrimary}>
              START CREATING
            </Link>
          </div>
        </section>

        {/* Personalised Jewellery */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>BESPOKE</span>
              <h2 className={styles.sectionTitle}>Personalised Jewellery</h2>
              <div className={styles.sectionDivider} />
            </div>
            <div className={styles.productsGrid}>
              {personalised.map((product, index) => (
                <div key={product.id} className={styles.productWrapper} style={{ animationDelay: `${index * 0.1}s` }}>
                  <ProductCard
                    {...product}
                    category={product.category}
                  />
                </div>
              ))}
            </div>
            <div className={styles.centerBtn}>
              <Link href="/shop/personalised-jewellery" className={styles.viewAllBtn}>
                <span>EXPLORE MORE</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Brand Story Section */}
        <section className={styles.brandSection}>
          <div className={styles.brandContent}>
            <span className={styles.brandLabel}>OUR STORY</span>
            <h2 className={styles.brandTitle}>Sun Kissed You</h2>
            <div className={styles.brandDivider} />
            <p className={styles.brandText}>
              A high-quality jewellery brand that strives to provide pieces fostering self-love and confidence while fitting seamlessly into daily life.
            </p>
            <p className={styles.brandText}>
              All pieces are crafted with 18K Gold Plated Stainless Steel — water resistant and tarnish free.
            </p>
            <div className={styles.brandFeatures}>
              <div className={styles.brandFeature}>
                <span className={styles.featureIcon}>✦</span>
                <span>18K Gold Plated</span>
              </div>
              <div className={styles.brandFeature}>
                <span className={styles.featureIcon}>✦</span>
                <span>Water Resistant</span>
              </div>
              <div className={styles.brandFeature}>
                <span className={styles.featureIcon}>✦</span>
                <span>Tarnish Free</span>
              </div>
            </div>
          </div>
        </section>

        {/* Best Sellers */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>MOST LOVED</span>
              <h2 className={styles.sectionTitle}>Best Sellers</h2>
              <div className={styles.sectionDivider} />
            </div>
            <div className={styles.productsGrid}>
              {bestSellers.map((product, index) => (
                <div key={product.id} className={styles.productWrapper} style={{ animationDelay: `${index * 0.1}s` }}>
                  <ProductCard
                    {...product}
                    category={product.category}
                  />
                </div>
              ))}
            </div>
            <div className={styles.centerBtn}>
              <Link href="/shop" className={styles.viewAllBtn}>
                <span>SHOP ALL</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
