'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { postJson } from '@/lib/api'

export function StopTracking({ slug, name }: { slug: string; name: string }) {
  const router = useRouter()
  const [asking, setAsking] = useState(false)
  const [pending, start] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function stop() {
    start(async () => {
      try {
        await postJson(`/api/skills/${slug}/progress`, {}, 'DELETE')
        router.refresh()
        setAsking(false)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Something went wrong')
      }
    })
  }

  if (!asking) {
    return (
      <button type="button" className="text-xs text-faint underline-offset-4 hover:text-muted hover:underline" onClick={() => setAsking(true)}>
        Stop tracking {name}
      </button>
    )
  }

  return (
    <div className="rounded-xl border border-line p-4 text-sm">
      <p>This clears your position and timeline for this tree. Form checks stay in your history.</p>
      <div className="mt-3 flex gap-2">
        <button type="button" className="btn-quiet" onClick={() => setAsking(false)} disabled={pending}>
          Keep it
        </button>
        <button type="button" className="btn-danger" onClick={stop} disabled={pending}>
          {pending ? 'Stopping…' : 'Stop tracking'}
        </button>
      </div>
      {error && <p className="mt-2 text-danger">{error}</p>}
    </div>
  )
}
