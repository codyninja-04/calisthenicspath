'use client'

/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import type { FormAnalysis, ProgressionStep } from '@/lib/types'
import { FormFeedback } from './FormFeedback'

const MAX_FRAMES = 3
// Claude downsizes anything bigger than this on its side anyway, so sending more
// pixels only costs upload time on a phone at the park.
const MAX_EDGE = 1568

interface Frame {
  blob: Blob
  url: string
}

function drawToBlob(source: CanvasImageSource, width: number, height: number): Promise<Blob> {
  const scale = Math.min(1, MAX_EDGE / Math.max(width, height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(width * scale)
  canvas.height = Math.round(height * scale)
  const ctx = canvas.getContext('2d')
  if (!ctx) return Promise.reject(new Error('Your browser could not process that image'))
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height)
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not process that image'))), 'image/jpeg', 0.85)
  )
}

async function imageFileToBlob(file: File): Promise<Blob> {
  const url = URL.createObjectURL(file)
  try {
    const img = new Image()
    img.src = url
    await img.decode()
    return await drawToBlob(img, img.naturalWidth, img.naturalHeight)
  } catch {
    throw new Error("That photo couldn't be read. Try a JPEG or PNG, or take a screenshot of it.")
  } finally {
    URL.revokeObjectURL(url)
  }
}

export function FormCheckUpload({
  slug,
  treeName,
  steps,
  defaultLevel,
}: {
  slug: string
  treeName: string
  steps: ProgressionStep[]
  defaultLevel: number
}) {
  const [mode, setMode] = useState<'photo' | 'video'>('photo')
  const [frames, setFrames] = useState<Frame[]>([])
  const [level, setLevel] = useState(defaultLevel)
  const [note, setNote] = useState('')
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [duration, setDuration] = useState(0)
  const [time, setTime] = useState(0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<FormAnalysis | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Free object URLs when frames or the video change.
  useEffect(() => () => frames.forEach((f) => URL.revokeObjectURL(f.url)), [frames])
  useEffect(() => () => (videoUrl ? URL.revokeObjectURL(videoUrl) : undefined), [videoUrl])

  function addFrame(blob: Blob) {
    setFrames((prev) => (prev.length >= MAX_FRAMES ? prev : [...prev, { blob, url: URL.createObjectURL(blob) }]))
  }

  async function onPhotos(files: FileList | null) {
    if (!files) return
    setError(null)
    try {
      for (const file of Array.from(files).slice(0, MAX_FRAMES - frames.length)) {
        addFrame(await imageFileToBlob(file))
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not read that photo')
    }
  }

  function onVideo(files: FileList | null) {
    const file = files?.[0]
    if (!file) return
    setError(null)
    setVideoUrl(URL.createObjectURL(file))
    setTime(0)
  }

  async function grabFrame() {
    const v = videoRef.current
    if (!v || !v.videoWidth) return
    try {
      addFrame(await drawToBlob(v, v.videoWidth, v.videoHeight))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not grab that frame')
    }
  }

  function seek(t: number) {
    setTime(t)
    if (videoRef.current) videoRef.current.currentTime = t
  }

  function removeFrame(i: number) {
    setFrames((prev) => prev.filter((_, j) => j !== i))
  }

  async function submit() {
    if (frames.length === 0) return
    setBusy(true)
    setError(null)
    const body = new FormData()
    body.set('skill', slug)
    body.set('level', String(level))
    if (note.trim()) body.set('note', note.trim())
    frames.forEach((f, i) => body.append('frames', f.blob, `frame-${i}.jpg`))

    try {
      const res = await fetch('/api/form-check', { method: 'POST', body })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'The form check failed. Try again.')
      setResult(data.analysis as FormAnalysis)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'The form check failed. Try again.')
    } finally {
      setBusy(false)
    }
  }

  function reset() {
    setResult(null)
    setFrames([])
    setVideoUrl(null)
    setNote('')
  }

  if (result) {
    return (
      <div className="space-y-6 animate-rise-in">
        <div className="grid grid-cols-3 gap-2 sm:max-w-md">
          {frames.map((f, i) => (
            <img key={f.url} src={f.url} alt={`Frame ${i + 1}`} className="aspect-square w-full rounded-xl object-cover" />
          ))}
        </div>
        <section className="card p-5 sm:p-6">
          <p className="label">{steps[level]?.name}</p>
          <div className="mt-4">
            <FormFeedback analysis={result} />
          </div>
        </section>
        <div className="flex flex-wrap gap-2">
          <Link href={`/skill/${slug}`} className="btn-primary">
            Back to {treeName}
          </Link>
          <button type="button" onClick={reset} className="btn-ghost">
            Check another attempt
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_0.75fr]">
      <div className="space-y-6">
        <div className="inline-flex rounded-xl border border-line bg-surface p-1" role="tablist" aria-label="Upload type">
          {(['photo', 'video'] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => setMode(m)}
              className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition ${mode === m ? 'bg-primary text-primary-ink' : 'text-muted hover:text-text'}`}
            >
              {m === 'photo' ? 'Photo' : 'Video frames'}
            </button>
          ))}
        </div>

        {mode === 'photo' ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="card flex cursor-pointer flex-col items-center justify-center gap-2 border-dashed p-6 text-center hover:border-primary/60">
              <svg viewBox="0 0 24 24" className="h-7 w-7 text-primary" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                <path d="M3 8a2 2 0 0 1 2-2h2l1.5-2h7L17 6h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              <span className="text-sm font-semibold">Take a photo</span>
              <span className="text-xs text-muted">Opens the camera on your phone</span>
              <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={(e) => onPhotos(e.target.files)} disabled={frames.length >= MAX_FRAMES} />
            </label>
            <label className="card flex cursor-pointer flex-col items-center justify-center gap-2 border-dashed p-6 text-center hover:border-primary/60">
              <svg viewBox="0 0 24 24" className="h-7 w-7 text-muted" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <circle cx="8.5" cy="9.5" r="1.5" />
                <path d="M21 16l-5-5-8 8" />
              </svg>
              <span className="text-sm font-semibold">Choose photos</span>
              <span className="text-xs text-muted">Up to {MAX_FRAMES} from the same attempt</span>
              <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only" onChange={(e) => onPhotos(e.target.files)} disabled={frames.length >= MAX_FRAMES} />
            </label>
          </div>
        ) : (
          <div className="space-y-3">
            {!videoUrl ? (
              <label className="card flex cursor-pointer flex-col items-center justify-center gap-2 border-dashed p-8 text-center hover:border-primary/60">
                <svg viewBox="0 0 24 24" className="h-7 w-7 text-primary" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                  <rect x="3" y="6" width="13" height="12" rx="2" />
                  <path d="M16 10l5-3v10l-5-3" />
                </svg>
                <span className="text-sm font-semibold">Pick a video of your set</span>
                <span className="text-xs text-muted">It stays on your phone. Only the frames you grab are uploaded.</span>
                <input type="file" accept="video/*" className="sr-only" onChange={(e) => onVideo(e.target.files)} />
              </label>
            ) : (
              <div className="card space-y-3 p-3">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  playsInline
                  muted
                  preload="auto"
                  onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
                  className="max-h-[420px] w-full rounded-xl bg-black object-contain"
                />
                <label className="block px-1">
                  <span className="sr-only">Scrub through the video</span>
                  <input
                    type="range"
                    min={0}
                    max={duration || 0}
                    step={0.04}
                    value={time}
                    onChange={(e) => seek(Number(e.target.value))}
                    className="w-full accent-[#F97316]"
                  />
                </label>
                <div className="flex items-center justify-between gap-2 px-1">
                  <span className="text-xs tabular-nums text-muted">
                    {time.toFixed(1)}s / {duration.toFixed(1)}s
                  </span>
                  <div className="flex gap-2">
                    <button type="button" className="btn-quiet px-3 py-1.5 text-xs" onClick={() => setVideoUrl(null)}>
                      Different video
                    </button>
                    <button type="button" className="btn-primary px-3 py-1.5 text-xs" onClick={grabFrame} disabled={frames.length >= MAX_FRAMES}>
                      Grab this frame
                    </button>
                  </div>
                </div>
              </div>
            )}
            <p className="text-xs text-faint">
              Scrub to the hardest moment, like the top of the pull or the middle of the hold. Grab up to {MAX_FRAMES} frames.
            </p>
          </div>
        )}

        {frames.length > 0 && (
          <div>
            <p className="label mb-2">
              Frames {frames.length}/{MAX_FRAMES}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {frames.map((f, i) => (
                <div key={f.url} className="relative">
                  <img src={f.url} alt={`Frame ${i + 1}`} className="aspect-square w-full rounded-xl object-cover" />
                  <button
                    type="button"
                    onClick={() => removeFrame(i)}
                    className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-bg/80 text-sm text-text hover:bg-bg"
                    aria-label={`Remove frame ${i + 1}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="label text-[0.7rem]">Step in the photo</span>
            <select value={level} onChange={(e) => setLevel(Number(e.target.value))} className="input mt-1.5">
              {steps.map((s) => (
                <option key={s.level} value={s.level}>
                  {s.level + 1}. {s.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="label text-[0.7rem]">Anything to add? (optional)</span>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, 500))}
              placeholder="e.g. last rep of the set, left shoulder feels tight"
              className="input mt-1.5"
            />
          </label>
        </div>

        {error && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}

        <button type="button" onClick={submit} disabled={busy || frames.length === 0} className="btn-primary w-full py-3 sm:w-auto">
          {busy ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-ink/30 border-t-primary-ink" aria-hidden />
              Looking at your form…
            </>
          ) : (
            'Check my form'
          )}
        </button>
      </div>

      <aside className="card h-fit p-5">
        <p className="label">Getting a useful photo</p>
        <ul className="mt-3 space-y-3 text-sm text-muted">
          <li>
            <span className="font-semibold text-text">Side on.</span> Most form faults (hips, elbows, body line) only show from the side.
          </li>
          <li>
            <span className="font-semibold text-text">Whole body in frame.</span> Hands to feet, with a bit of space around you.
          </li>
          <li>
            <span className="font-semibold text-text">Phone at hip height.</span> Prop it on a bag or bench, not on the floor looking up.
          </li>
          <li>
            <span className="font-semibold text-text">The hardest moment.</span> The top of a pull, the bottom of a dip, or deep into a hold.
          </li>
          <li>
            <span className="font-semibold text-text">Light behind the camera,</span> not behind you.
          </li>
        </ul>
        <p className="mt-4 border-t border-line pt-4 text-xs leading-relaxed text-faint">
          Photos are private to your account. Feedback comes from Claude and is a second pair of eyes, not a coach watching you live.
          If something hurts, stop and get it looked at.
        </p>
      </aside>
    </div>
  )
}
