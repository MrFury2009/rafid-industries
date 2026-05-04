'use client'

import { useEffect } from 'react'

export default function ViewTracker({ pathname }: { pathname: string }) {
  useEffect(() => {
    fetch('/api/track-view', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ page: pathname }),
    }).catch(() => {})
  }, [pathname])

  return null
}
