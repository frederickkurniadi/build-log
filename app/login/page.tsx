import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signInWithEmail } from './actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/admin')

  const { sent, error } = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <span className="inline-block h-2 w-2 rounded-full bg-primary" />
          Build Log
        </Link>

        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          We&rsquo;ll send a magic link to your email.
        </p>

        {sent ? (
          <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm">
            Check your email for the sign-in link.
          </div>
        ) : (
          <form action={signInWithEmail} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
            </div>
            {error && (
              <p className="text-sm text-destructive">{decodeURIComponent(error)}</p>
            )}
            <Button type="submit" className="w-full">Send magic link</Button>
          </form>
        )}
      </div>
    </div>
  )
}
