'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BUILD_STATUSES, type BuildStatus } from '@/lib/types'

function parseTools(input: string): string[] {
  return input
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

function isStatus(value: string): value is BuildStatus {
  return (BUILD_STATUSES as string[]).includes(value)
}

async function uploadThumbnail(file: File, userId: string): Promise<string | null> {
  if (!file || file.size === 0) return null
  const supabase = await createClient()
  const ext = file.name.split('.').pop() ?? 'png'
  const path = `${userId}/${Date.now()}-${crypto.randomUUID()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('thumbnails')
    .upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type })

  if (uploadError) throw uploadError

  const { data } = supabase.storage.from('thumbnails').getPublicUrl(path)
  return data.publicUrl
}

export async function createBuild(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const file = formData.get('thumbnail') as File | null
  const thumbnailUrl = file && file.size > 0 ? await uploadThumbnail(file, user.id) : null

  const statusInput = String(formData.get('status') ?? '')

  const row = {
    date: String(formData.get('date') ?? new Date().toISOString().slice(0, 10)),
    project_name: String(formData.get('project_name') ?? '').trim(),
    category: String(formData.get('category') ?? '').trim() || null,
    status: isStatus(statusInput) ? statusInput : null,
    time_spent: String(formData.get('time_spent') ?? '').trim() || null,
    tools_used: parseTools(String(formData.get('tools_used') ?? '')),
    learning: String(formData.get('learning') ?? '').trim() || null,
    thumbnail_url: thumbnailUrl,
    live_link: String(formData.get('live_link') ?? '').trim() || null,
    repo: String(formData.get('repo') ?? '').trim() || null,
    owner_id: user.id,
  }

  if (!row.project_name) {
    redirect('/admin?error=missing-project-name')
  }

  const { error } = await supabase.from('builds').insert(row)
  if (error) redirect(`/admin?error=${encodeURIComponent(error.message)}`)

  revalidatePath('/')
  revalidatePath('/admin')
  redirect('/admin')
}

export async function updateBuild(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const file = formData.get('thumbnail') as File | null
  const newThumbnail = file && file.size > 0 ? await uploadThumbnail(file, user.id) : null

  const statusInput = String(formData.get('status') ?? '')

  const update: Record<string, unknown> = {
    date: String(formData.get('date') ?? new Date().toISOString().slice(0, 10)),
    project_name: String(formData.get('project_name') ?? '').trim(),
    category: String(formData.get('category') ?? '').trim() || null,
    status: isStatus(statusInput) ? statusInput : null,
    time_spent: String(formData.get('time_spent') ?? '').trim() || null,
    tools_used: parseTools(String(formData.get('tools_used') ?? '')),
    learning: String(formData.get('learning') ?? '').trim() || null,
    live_link: String(formData.get('live_link') ?? '').trim() || null,
    repo: String(formData.get('repo') ?? '').trim() || null,
  }
  if (newThumbnail) update.thumbnail_url = newThumbnail

  const { error } = await supabase.from('builds').update(update).eq('id', id)
  if (error) redirect(`/admin?error=${encodeURIComponent(error.message)}`)

  revalidatePath('/')
  revalidatePath('/admin')
  redirect('/admin')
}

export async function deleteBuild(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  if (!id) return

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase.from('builds').delete().eq('id', id)
  revalidatePath('/')
  revalidatePath('/admin')
}
