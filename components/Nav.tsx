'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import { fadeIn } from '@/lib/motion'

export function Nav() {
  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-40"
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      aria-label="Main navigation"
    >
      {/* Frosted backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundColor: 'rgba(245,244,239,0.88)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(26,26,26,0.07)',
        }}
      />

      <div className="relative px-6 md:px-12 lg:px-20">
        <NavigationMenu.Root className="flex items-center justify-between h-16">
          {/* Wordmark */}
          <NavigationMenu.List asChild>
            <div className="flex items-center gap-10 list-none m-0 p-0">
              <NavigationMenu.Item>
                <NavigationMenu.Link asChild>
                  <Link
                    href="/"
                    className="flex items-center select-none"
                    aria-label="Rafid Industries — home"
                  >
                    <span
                      className="text-sm font-medium tracking-[0.12em] uppercase"
                      style={{
                        fontFamily: 'var(--font-dm-sans)',
                        color: '#1A1A1A',
                        letterSpacing: '0.12em',
                      }}
                    >
                      Rafid Industries
                    </span>
                  </Link>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            </div>
          </NavigationMenu.List>

          {/* Right links */}
          <NavigationMenu.List className="flex items-center gap-8 list-none m-0 p-0">
            <NavigationMenu.Item>
              <NavigationMenu.Link asChild>
                <NavLink href="/tools">Educational Tools</NavLink>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          </NavigationMenu.List>

          <NavigationMenu.Indicator />
        </NavigationMenu.Root>
      </div>
    </motion.nav>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function NavLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="relative text-[11px] uppercase tracking-[0.16em] select-none transition-opacity"
      style={{
        fontFamily: 'var(--font-dm-sans)',
        color: '#1A1A1A',
        opacity: 0.5,
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLElement).style.opacity = '1'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLElement).style.opacity = '0.5'
      }}
    >
      {children}
    </Link>
  )
}
