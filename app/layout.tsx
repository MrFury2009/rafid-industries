import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { DM_Mono, Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'
import PageTransition from '@/components/PageTransition'

const dmSans = localFont({
  src: [
    { path: '../public/fonts/DMSans-Light.ttf', weight: '300', style: 'normal' },
    { path: '../public/fonts/DMSans-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../public/fonts/DMSans-Italic.ttf', weight: '400', style: 'italic' },
    { path: '../public/fonts/DMSans-Medium.ttf', weight: '500', style: 'normal' },
    { path: '../public/fonts/DMSans-MediumItalic.ttf', weight: '500', style: 'italic' },
    { path: '../public/fonts/DMSans-SemiBold.ttf', weight: '600', style: 'normal' },
    { path: '../public/fonts/DMSans-Bold.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-dm-sans',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-mono',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Rafid Industries',
  description: 'Precision software. Built in public.',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light" />
        {/* Read localStorage before first paint — prevents dark mode flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(localStorage.getItem('ri_dark')==='1')document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${dmSans.variable} ${dmMono.variable} ${cormorant.variable} font-sans antialiased bg-bg dark:bg-dark-bg text-ink dark:text-dark-text`}>
        <Nav />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  )
}
