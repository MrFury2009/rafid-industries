import { NextResponse } from 'next/server'

// Lightweight pass-through middleware.
// Pageview tracking is handled client-side to avoid Edge runtime fetch issues.
export function middleware() {
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
