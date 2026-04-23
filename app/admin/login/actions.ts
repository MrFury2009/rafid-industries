'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyAdminPassword } from '@/lib/auth'

export async function loginAction(
  formData: FormData,
): Promise<{ error: string } | void> {
  const password = formData.get('password')

  if (typeof password !== 'string' || !password) {
    return { error: 'Password is required.' }
  }

  const valid = verifyAdminPassword(password)

  if (!valid) {
    return { error: 'Incorrect password.' }
  }

  // Set secure, HTTP-only session cookie — never readable from JS
  cookies().set('ri-admin-session', password, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  })

  redirect('/admin')
}
