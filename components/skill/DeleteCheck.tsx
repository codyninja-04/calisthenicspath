'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { postJson } from '@/lib/api'

export function DeleteCheck({ id }: { id: string }) {
  const router = useRouter()
  const [asking, setAsking] = useState(false)
  const [pending, start] = useTransition()

  if (!asking) {
    return (
      <button type="button" className="text-xs text-faint hover:text-muted" onClick={() => setAsking(true)}>
        Delete check and photos
      </button>
    )
  }

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-muted">Delete for good?</span>
      <button type="button" className="btn-quiet px-2 py-1 text-xs" onClick={() => setAsking(false)} disabled={pending}>
        No
      </button>
      <button
        type="button"
        className="btn-danger px-2.5 py-1 text-xs"
        disabled={pending}
        onClick={() =>
          start(async () => {
            try {
              await postJson('/api/form-check', { id }, 'DELETE')
            } finally {
              setAsking(false)
              router.refresh()
            }
          })
        }
      >
        {pending ? 'Deleting…' : 'Delete'}
      </button>
    </div>
  )
}
