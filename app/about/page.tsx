import RevealOnScroll from '@/components/RevealOnScroll'

export const metadata = {
  title: 'About — Rafid Industries',
  description: 'Precision software, built in public.',
}

export default function AboutPage() {
  return (
    <main className="max-w-[1200px] mx-auto px-6 py-16">
      <RevealOnScroll>
        <h1 className="font-display font-light text-4xl md:text-5xl text-ink dark:text-dark-text mb-6">
          About
        </h1>
        <div className="max-w-2xl space-y-4 font-sans text-base text-ink/70 dark:text-dark-text/70 leading-relaxed">
          <p>
            Rafid Industries builds precision software — tools and products that do exactly
            what they say, without accounts, without AI black boxes, without noise.
          </p>
          <p>
            Everything is built in public, shipped fast, and kept simple.
          </p>
        </div>
      </RevealOnScroll>
    </main>
  )
}
