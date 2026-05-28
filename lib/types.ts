export type BuildStatus = 'Planning' | 'In Progress' | 'Shipped' | 'Archived'

export const BUILD_STATUSES: BuildStatus[] = ['Planning', 'In Progress', 'Shipped', 'Archived']

export type Build = {
  id: string
  date: string
  project_name: string
  category: string | null
  status: BuildStatus | null
  time_spent: string | null
  tools_used: string[] | null
  learning: string | null
  thumbnail_url: string | null
  live_link: string | null
  repo: string | null
  owner_id: string | null
  created_at: string
}
