'use client'

import Link from 'next/link'
import { StaggerContainer, StaggerItem } from '@/components/ui/Stagger'

const TOOLS = [
  {
    id: 'apa',
    title: 'APA Reference Generator',
    description: 'Generate APA 7 citations from DOIs, ISBNs, URLs, and more.',
    active: true,
    href: '/tools/apa',
  },
  {
    id: 'mla',
    title: 'MLA Generator',
    description: 'Create accurate MLA 9 citations for your academic work.',
    active: false,
  },
  {
    id: 'chicago',
    title: 'Chicago Generator',
    description: 'Format citations in Chicago style (Notes-Bibliography and Author-Date).',
    active: false,
  },
  {
    id: 'wordcount',
    title: 'Word Counter',
    description: 'Analyze text length, character count, readability, and more.',
    active: false,
  },
  {
    id: 'gpa',
    title: 'GPA Calculator',
    description: 'Calculate your GPA and track academic performance.',
    active: false,
  },
  {
    id: 'timer',
    title: 'Study Timer',
    description: 'Pomodoro timer and study session tracker.',
    active: false,
  },
]

export default function ToolsPage() {
  return (
    <StaggerContainer>
      <main className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <h1
            className="font-serif text-4xl md:text-5xl font-light tracking-tight mb-4"
            style={{ color: 'var(--text)' }}
          >
            Educational Tools
          </h1>
          <p className="text-lg md:text-xl" style={{ color: 'var(--muted)' }}>
            Free, precise tools for students and researchers.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TOOLS.map((tool, idx) => {
            const Card = tool.active ? Link : 'div'
            const cardProps = tool.active ? { href: tool.href } : {}

            return (
              <StaggerItem key={tool.id} index={idx} staggerMs={60} duration={400}>
                <Card
                  {...cardProps}
                  className={`rounded-none border p-6 transition-all duration-200 ${
                    tool.active
                      ? 'hover:border-sage cursor-pointer'
                      : 'opacity-60 cursor-not-allowed'
                  }`}
                  style={{
                    backgroundColor: 'var(--surface)',
                    borderColor: tool.active ? 'var(--border)' : 'var(--border)',
                  }}
                >
                  <h2
                    className="text-xl font-semibold mb-2"
                    style={{ color: 'var(--text)' }}
                  >
                    {tool.title}
                  </h2>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>
                    {tool.description}
                  </p>
                  {!tool.active && (
                    <div className="mt-4 inline-block rounded-none bg-sage/10 px-3 py-1">
                      <span className="text-xs font-semibold" style={{ color: 'var(--sage)' }}>
                        Coming soon
                      </span>
                    </div>
                  )}
                </Card>
              </StaggerItem>
            )
          })}
        </div>
      </main>
    </StaggerContainer>
  )
}
