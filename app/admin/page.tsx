import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SiteHeader } from '@/components/site-header'
import { BuildForm } from '@/components/build-form'
import { AdminRow } from '@/components/admin-row'
import { createBuild, deleteBuild, updateBuild } from './actions'
import type { Build } from '@/lib/types'

export const revalidate = 0

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: builds } = await supabase
    .from('builds')
    .select('*')
    .order('date', { ascending: false })

  const list = (builds ?? []) as Build[]
  const { error } = await searchParams

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="container mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Admin</h1>
            <p className="mt-2 text-sm text-muted-foreground">Signed in as {user.email}</p>
          </div>
          <BuildForm action={createBuild} title="New build" description="Add a project to your log." />
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
        ) : (
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
        )}
      </main>
    </div>
  )
}
