import Image from 'next/image'
import { PageWrapper } from '@/components/PageWrapper'
import { RevealSection } from '@/components/RevealSection'

export const metadata = {
  title: 'About',
  description: 'The team behind Rafid Industries.',
}

export default function AboutPage() {
  return (
    <PageWrapper>
      <main className="px-6 py-20" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="mx-auto max-w-4xl">
          <RevealSection>
            <header className="mb-16 text-center">
              <h1
                className="font-serif text-4xl font-semibold lg:text-5xl"
                style={{ color: 'var(--text)' }}
              >
                About Rafid Industries
              </h1>
              <p
                className="mx-auto mt-4 max-w-xl text-base leading-relaxed"
                style={{ color: 'var(--muted)' }}
              >
                We build the intelligence layer for tomorrow's airspace —
                so operators can focus on flying, not paperwork.
              </p>
            </header>
          </RevealSection>

          <RevealSection delay={60}>
            <section className="mb-16 grid gap-12 md:grid-cols-2">
              <div>
                <h2
                  className="font-serif text-2xl font-semibold"
                  style={{ color: 'var(--text)' }}
                >
                  Our Mission
                </h2>
                <p
                  className="mt-4 text-sm leading-relaxed"
                  style={{ color: 'var(--muted)' }}
                >
                  Rafid Industries was founded on the belief that airspace
                  should be accessible — not a bureaucratic maze. We combine
                  real-time data, elegant software, and deep aviation expertise
                  to make drone operations safer and simpler for everyone.
                </p>
              </div>
              <div
                className="relative h-48 overflow-hidden rounded-xl"
                style={{ backgroundColor: 'var(--surface)' }}
              >
                <Image
                  src="/images/hero/sky-1.svg"
                  alt="Clear skies — our mission"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain p-8"
                />
              </div>
            </section>
          </RevealSection>

          <RevealSection delay={120}>
            <section
              className="rounded-2xl border p-8"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: 'var(--surface)',
              }}
            >
              <h2
                className="font-serif text-2xl font-semibold"
                style={{ color: 'var(--text)' }}
              >
                Core Values
              </h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-3">
                {[
                  {
                    title: 'Safety First',
                    body: 'Every feature we ship goes through rigorous safety review.',
                  },
                  {
                    title: 'Radical Clarity',
                    body: 'Complex airspace data, distilled into simple interfaces.',
                  },
                  {
                    title: 'Operator Trust',
                    body: "We build for the pilots who bet their livelihood on our software.",
                  },
                ].map(({ title, body }) => (
                  <div key={title}>
                    <p
                      className="font-serif text-base font-semibold"
                      style={{ color: 'var(--sage)' }}
                    >
                      {title}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                      {body}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </RevealSection>
        </div>
      </main>
    </PageWrapper>
  )
}
