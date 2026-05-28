import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { LogIn, LogOut, Plus } from 'lucide-react'
import { signOut } from '@/app/login/actions'

export async function SiteHeader() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="inline-block h-2 w-2 rounded-full bg-primary" />
          Build Log
        </Link>
        <nav className="flex items-center gap-2">
          {user ? (
            <>
              <Button asChild size="sm">
                <Link href="/admin"><Plus className="h-4 w-4" /> New build</Link>
              </Button>
              <form action={signOut}>
                <Button type="submit" variant="ghost" size="sm">
                  <LogOut className="h-4 w-4" /> Sign out
                </Button>
              </form>
            </>
          ) : (
            <Button asChild variant="ghost" size="sm">
              <Link href="/login"><LogIn className="h-4 w-4" /> Sign in</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  )
}
