import Link from 'next/link'
import { redirect } from 'next/navigation'
import { LayoutGrid, List } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { SiteHeader } from '@/components/site-header'
import { BuildForm } from '@/components/build-form'
import { AdminRow } from '@/components/admin-row'
import { AdminListRow } from '@/components/admin-list-row'
import { createBuild, deleteBuild, updateBuild } from './actions'
import type { Build } from '@/lib/types'

export const revalidate = 0

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; view?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: builds } = await supabase
    .from('builds')
    .select('*')
    .order('date', { ascending: false })

  const list = (builds ?? []) as Build[]
  const { error, view } = await searchParams
  const isGrid = view !== 'list'

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="container mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Admin</h1>
            <p className="mt-2 text-sm text-muted-foreground">Signed in as {user.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex overflow-hidden rounded-lg border border-border">
              <Link
                href="/admin?view=grid"
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors ${isGrid ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <LayoutGrid className="h-3.5 w-3.5" /> Grid
              </Link>
              <Link
                href="/admin?view=list"
                className={`flex items-center gap-1.5 border-l border-border px-3 py-1.5 text-sm transition-colors ${!isGrid ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <List className="h-3.5 w-3.5" /> List
              </Link>
            </div>
            <BuildForm action={createBuild} title="New build" description="Add a project to your log." />
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
            {decodeURIComponent(error)}
          </div>
        )}

        {list.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            No builds yet. Click <span className="font-medium">New build</span> to add one.
          </div>
        ) : isGrid ? (
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((b) => (
              <AdminRow
                key={b.id}
                build={b}
                updateAction={updateBuild.bind(null, b.id)}
                deleteAction={deleteBuild}
              />
            ))}
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-xs font-medium text-muted-foreground">
                  <th className="w-16 px-4 py-2"></th>
                  <th className="hidden px-4 py-2 text-left font-medium sm:table-cell">Date</th>
                  <th className="px-4 py-2 text-left font-medium">Project</th>
                  <th className="px-4 py-2 text-left font-medium">Status</th>
                  <th className="hidden px-4 py-2 text-left font-medium sm:table-cell">Category</th>
                  <th className="hidden px-4 py-2 text-left font-medium md:table-cell">Time</th>
                  <th className="hidden px-4 py-2 text-left font-medium lg:table-cell">Tools</th>
                  <th className="px-4 py-2 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((b) => (
                  <AdminListRow
                    key={b.id}
                    build={b}
                    updateAction={updateBuild.bind(null, b.id)}
                    deleteAction={deleteBuild}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
