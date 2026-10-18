import { ProgressionPreview } from '@/components/skilltrees/ProgressionPreview'

// The right side shows a real tree with a position on it, so the idea lands
// before anyone signs in.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.05fr]">
      <div className="flex items-center justify-center px-6 py-16">{children}</div>
      <div className="grid-lines relative hidden flex-col justify-center overflow-hidden border-l border-line bg-surface/40 px-14 lg:flex">
        <div className="max-w-md">
          <p className="label">Where most people are stuck</p>
          <p className="heading mt-2 text-3xl">Six band-assisted reps. Not sure when to drop the band.</p>
          <div className="mt-8">
            <ProgressionPreview />
          </div>
        </div>
      </div>
    </div>
  )
}
