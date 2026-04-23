import type { Metadata } from 'next'
import { DM_Sans, Cormorant_Garamond } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Nav } from '@/components/Nav'

// ── next/font: server-side font loading — no Google Fonts <link> tags ──
const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Rafid Industries',
    template: '%s | Rafid Industries',
  },
  description: 'Precision drone technology and airspace intelligence.',
  metadataBase: new URL('https://rafidindustries.com'),
}

// Inline script that runs before React hydrates — prevents flash of wrong theme.
// Must NOT reference any module-level variable (runs in isolation).
const THEME_INIT_SCRIPT = `
(function(){
  try{
    var t=localStorage.getItem('ri-theme');
    if(t==='dark'||(t==null&&window.matchMedia('(prefers-color-scheme:dark)').matches)){
      document.documentElement.classList.add('dark');
    }
  }catch(e){}
})();
`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSans.variable} ${cormorant.variable}`}
    >
      <head>
        {/*
          beforeInteractive: executes before the page is interactive,
          before React hydration. Prevents flash of wrong theme.
        */}
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
        />
      </head>
      <body>
        <ThemeProvider>
          <Nav />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
