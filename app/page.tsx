import Link from 'next/link'
import { LayoutGrid, List } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { SiteHeader } from '@/components/site-header'
import { BuildCard } from '@/components/build-card'
import { BuildListRow } from '@/components/build-list-row'
import type { Build } from '@/lib/types'

export const revalidate = 0

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>
}) {
  const supabase = await createClient()
  const { data: builds } = await supabase
    .from('builds')
    .select('*')
    .order('date', { ascending: false })

  const list = (builds ?? []) as Build[]
  const { view } = await searchParams
  const isGrid = view !== 'list'

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
          <div className="flex items-center gap-3">
            {list.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {list.length} {list.length === 1 ? 'project' : 'projects'}
              </span>
            )}
            <div className="flex overflow-hidden rounded-lg border border-border">
              <Link
                href="/?view=grid"
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors ${isGrid ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <LayoutGrid className="h-3.5 w-3.5" /> Grid
              </Link>
              <Link
                href="/?view=list"
                className={`flex items-center gap-1.5 border-l border-border px-3 py-1.5 text-sm transition-colors ${!isGrid ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <List className="h-3.5 w-3.5" /> List
              </Link>
            </div>
          </div>
        </div>

        {list.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <p className="text-muted-foreground">No builds yet. Sign in to add the first one.</p>
          </div>
        ) : isGrid ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((b) => (
              <BuildCard key={b.id} build={b} />
            ))}
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-xs font-medium text-muted-foreground">
                  <th className="w-16 px-4 py-2"></th>
                  <th className="px-4 py-2 text-left font-medium">Date</th>
                  <th className="px-4 py-2 text-left font-medium">Project</th>
                  <th className="px-4 py-2 text-left font-medium">Status</th>
                  <th className="hidden px-4 py-2 text-left font-medium sm:table-cell">Category</th>
                  <th className="hidden px-4 py-2 text-left font-medium md:table-cell">Time</th>
                  <th className="hidden px-4 py-2 text-left font-medium lg:table-cell">Tools</th>
                  <th className="px-4 py-2 text-right font-medium">Links</th>
                </tr>
              </thead>
              <tbody>
                {list.map((b) => (
                  <BuildListRow key={b.id} build={b} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
