import { createClient } from '@/lib/supabase/server'
import { SiteHeader } from '@/components/site-header'
import { BuildCard } from '@/components/build-card'
import type { Build } from '@/lib/types'

export const revalidate = 0

export default async function HomePage() {
  const supabase = await createClient()
  const { data: builds } = await supabase
    .from('builds')
    .select('*')
    .order('date', { ascending: false })

  const list = (builds ?? []) as Build[]

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="container mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">Frederick&rsquo;s Build Log</h1>
            <p className="mt-2 text-muted-foreground">
              A running log of projects I&rsquo;ve built with Claude.
            </p>
          </div>
          {list.length > 0 && (
            <span className="text-sm text-muted-foreground">
              {list.length} {list.length === 1 ? 'project' : 'projects'}
            </span>
          )}
        </div>

        {list.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <p className="text-muted-foreground">No builds yet. Sign in to add the first one.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((b) => (
              <BuildCard key={b.id} build={b} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
