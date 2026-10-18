import { ImageResponse } from 'next/og'

export const runtime = 'edge'

const SIZES = new Set([180, 192, 512])

// PNG app icons for the manifest and iOS, drawn from the same shapes as
// public/icon.svg so there are no binary assets to keep in sync.
export function GET(request: Request, { params }: { params: { size: string } }) {
  const size = Number(params.size)
  if (!SIZES.has(size)) return new Response('Not found', { status: 404 })
  const maskable = new URL(request.url).searchParams.has('maskable')
  const scale = (maskable ? 0.72 : 1) * (size / 64)

  const bar = (x: number, y: number, h: number, color: string) => (
    <div
      style={{
        position: 'absolute',
        left: x * scale,
        top: y * scale,
        width: 10 * scale,
        height: h * scale,
        borderRadius: 2.5 * scale,
        background: color,
      }}
    />
  )

  return new ImageResponse(
    (
      <div
        style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F172A' }}
      >
        <div style={{ position: 'relative', width: 64 * scale, height: 64 * scale, display: 'flex' }}>
          {bar(13, 38, 14, '#16A34A')}
          {bar(27, 28, 24, '#16A34A')}
          {bar(41, 18, 34, '#F97316')}
          <div
            style={{
              position: 'absolute',
              left: 42 * scale,
              top: 6.5 * scale,
              width: 8 * scale,
              height: 8 * scale,
              borderRadius: 999,
              background: '#F97316',
            }}
          />
        </div>
      </div>
    ),
    { width: size, height: size, headers: { 'Cache-Control': 'public, max-age=604800, immutable' } }
  )
}
