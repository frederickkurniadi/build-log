'use client'

import Image from 'next/image'
import { ExternalLink, Github, Trash2 } from 'lucide-react'
import { BuildForm } from '@/components/build-form'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/status-badge'
import { ToolTag } from '@/components/tool-tag'
import type { Build } from '@/lib/types'

type ServerAction = (formData: FormData) => void | Promise<void>

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function AdminListRow({
  build,
  updateAction,
  deleteAction,
}: {
  build: Build
  updateAction: ServerAction
  deleteAction: ServerAction
}) {
  return (
    <tr className="border-b border-border hover:bg-muted/30 transition-colors">
      <td className="w-16 px-4 py-2">
        <div className="relative h-9 w-14 overflow-hidden rounded-md bg-muted">
          {build.thumbnail_url ? (
            <Image
              src={build.thumbnail_url}
              alt={build.project_name}
              fill
              sizes="56px"
              className="object-cover"
            />
          ) : null}
        </div>
      </td>

      <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">
        {formatDate(build.date)}
      </td>

      <td className="px-4 py-3 font-medium">{build.project_name}</td>

      <td className="px-4 py-3">
        {build.status && <StatusBadge status={build.status} />}
      </td>

      <td className="hidden px-4 py-3 text-xs text-muted-foreground sm:table-cell">
        {build.category ?? ''}
      </td>

      <td className="hidden px-4 py-3 text-xs text-muted-foreground md:table-cell">
        {build.time_spent ?? ''}
      </td>

      <td className="hidden px-4 py-3 lg:table-cell">
        {build.tools_used && build.tools_used.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {build.tools_used.slice(0, 2).map((tool) => (
              <ToolTag key={tool} name={tool} />
            ))}
            {build.tools_used.length > 2 && (
              <span className="rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground">
                +{build.tools_used.length - 2}
              </span>
            )}
          </div>
        )}
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1">
          {build.live_link && (
            <a
              href={build.live_link}
              target="_blank"
              rel="noreferrer"
              className="rounded p-1 text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
          {build.repo && (
            <a
              href={build.repo}
              target="_blank"
              rel="noreferrer"
              className="rounded p-1 text-muted-foreground hover:text-foreground"
            >
              <Github className="h-3.5 w-3.5" />
            </a>
          )}
          <BuildForm
            action={updateAction}
            initial={build}
            triggerLabel="Edit"
            triggerVariant="outline"
            title="Edit build"
          />
          <form action={deleteAction}>
            <input type="hidden" name="id" value={build.id} />
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={(e) => {
                if (!confirm(`Delete "${build.project_name}"? This can't be undone.`)) {
                  e.preventDefault()
                }
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </td>
    </tr>
  )
}
