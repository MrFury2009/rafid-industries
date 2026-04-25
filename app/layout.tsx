import type { Metadata } from 'next'
import { DM_Sans, Cormorant_Garamond } from 'next/font/google'
import { MotionProvider } from '@/components/MotionProvider'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['500'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Rafid Industries',
  description: 'Educational tools and products by Rafid Industries.',
  metadataBase: new URL('https://rafidindustries.com'),
  openGraph: {
    title: 'Rafid Industries',
    description: 'Educational tools and products by Rafid Industries.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${cormorant.variable}`}>
      <body
        className="bg-[#F5F4EF] text-[#1A1A1A] font-sans antialiased"
        style={{ fontFamily: 'var(--font-dm-sans), sans-serif' }}
      >
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  )
}
