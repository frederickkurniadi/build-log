import Image from 'next/image'
import { ExternalLink, Github } from 'lucide-react'
import { StatusBadge } from '@/components/status-badge'
import type { Build } from '@/lib/types'

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function BuildCard({ build }: { build: Build }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-md">
      <div className="relative aspect-video bg-muted">
        {build.thumbnail_url ? (
          <Image
            src={build.thumbnail_url}
            alt={build.project_name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            No thumbnail
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-medium tracking-tight">{build.project_name}</h2>
          {build.status && <StatusBadge status={build.status} />}
        </div>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          <span>{formatDate(build.date)}</span>
          {build.category && <><span>·</span><span>{build.category}</span></>}
          {build.time_spent && <><span>·</span><span>{build.time_spent}</span></>}
        </div>

        {build.learning && (
          <p className="text-sm text-muted-foreground line-clamp-3">{build.learning}</p>
        )}

        {build.tools_used && build.tools_used.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {build.tools_used.map((tool) => (
              <span
                key={tool}
                className="rounded-md border border-border bg-background px-2 py-0.5 text-xs text-muted-foreground"
              >
                {tool}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex gap-4 pt-2 text-sm">
          {build.live_link && (
            <a
              href={build.live_link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Live
            </a>
          )}
          {build.repo && (
            <a
              href={build.repo}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
            >
              <Github className="h-3.5 w-3.5" /> Repo
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
