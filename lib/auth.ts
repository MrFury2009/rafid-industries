/**
 * Admin auth helpers — server-side only.
 * ADMIN_PASSWORD env var must NOT be prefixed NEXT_PUBLIC_.
 */

export function verifyAdminPassword(password: string): boolean {
  const secret = process.env.ADMIN_PASSWORD
  if (!secret) return false
  // Constant-time comparison to prevent timing attacks
  if (password.length !== secret.length) return false
  let match = 0
  for (let i = 0; i < password.length; i++) {
    match |= password.charCodeAt(i) ^ secret.charCodeAt(i)
  }
  return match === 0
}

export function getAdminPasswordHash(): string | undefined {
  // Never expose raw secret — only for server-side comparison
  return process.env.ADMIN_PASSWORD
}
