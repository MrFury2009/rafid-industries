// No-op — middleware disabled, never matches any real route.
export function middleware() {}

export const config = {
  matcher: ['/_never_matches'],
}
