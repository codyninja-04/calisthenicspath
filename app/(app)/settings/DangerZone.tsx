'use client'

import { useState, useTransition } from 'react'
import { clearMyData, deleteAccount } from './actions'

export function DangerZone() {
  const [pending, start] = useTransition()
  const [confirming, setConfirming] = useState<'clear' | 'delete' | null>(null)

  return (
    <div className="space-y-4">
      <Row
        title="Clear my data"
        body="Removes your tree positions, timelines, form checks with their photos, and training log. Your account stays."
        action="Clear data"
        confirm="Yes, clear everything"
        active={confirming === 'clear'}
        pending={pending}
        onAsk={() => setConfirming('clear')}
        onCancel={() => setConfirming(null)}
        onConfirm={() => start(() => clearMyData())}
      />
      <Row
        title="Delete my account"
        body="Deletes the account, every photo and all your history. This can't be undone."
        action="Delete account"
        confirm="Yes, delete my account"
        active={confirming === 'delete'}
        pending={pending}
        onAsk={() => setConfirming('delete')}
        onCancel={() => setConfirming(null)}
        onConfirm={() => start(() => deleteAccount())}
      />
    </div>
  )
}

function Row(props: {
  title: string
  body: string
  action: string
  confirm: string
  active: boolean
  pending: boolean
  onAsk: () => void
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium">{props.title}</p>
        <p className="text-sm text-muted">{props.body}</p>
      </div>
      {props.active ? (
        <div className="flex shrink-0 gap-2">
          <button type="button" className="btn-quiet" onClick={props.onCancel} disabled={props.pending}>
            Cancel
          </button>
          <button type="button" className="btn-danger" onClick={props.onConfirm} disabled={props.pending}>
            {props.pending ? 'Working…' : props.confirm}
          </button>
        </div>
      ) : (
        <button type="button" className="btn-ghost shrink-0" onClick={props.onAsk}>
          {props.action}
        </button>
      )}
    </div>
  )
}
