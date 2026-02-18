import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: '--font-playfair',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "SUN KISSED YOU | Premium 18K Gold Plated Jewellery",
  description: "Discover exquisite 18K gold plated jewellery. Timeless elegance, water-resistant, tarnish-free pieces that foster self-love and confidence.",
  keywords: "luxury jewellery, gold plated, 18K gold, necklaces, bracelets, rings, earrings, premium jewellery",
  openGraph: {
    title: "SUN KISSED YOU | Premium 18K Gold Plated Jewellery",
    description: "Discover exquisite 18K gold plated jewellery. Timeless elegance, water-resistant, tarnish-free pieces.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${playfair.variable} ${dmSans.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
