import Link from 'next/link'

export default function NotFound() {
  return (
    <main
      className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <p
        className="font-serif text-8xl font-semibold"
        style={{ color: 'var(--border)' }}
      >
        404
      </p>
      <h1
        className="mt-4 font-serif text-2xl font-semibold"
        style={{ color: 'var(--text)' }}
      >
        Page Not Found
      </h1>
      <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-full px-6 py-3 text-sm font-semibold"
        style={{ backgroundColor: 'var(--sage)', color: '#fff' }}
      >
        Go Home
      </Link>
    </main>
  )
}
