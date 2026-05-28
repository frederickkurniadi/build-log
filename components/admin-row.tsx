'use client'

import { Trash2 } from 'lucide-react'
import { BuildForm } from '@/components/build-form'
import { Button } from '@/components/ui/button'
import { BuildCard } from '@/components/build-card'
import type { Build } from '@/lib/types'

type ServerAction = (formData: FormData) => void | Promise<void>

export function AdminRow({
  build,
  updateAction,
  deleteAction,
}: {
  build: Build
  updateAction: ServerAction
  deleteAction: ServerAction
}) {
  return (
    <div className="relative">
      <BuildCard build={build} />
      <div className="mt-3 flex gap-2">
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
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </form>
      </div>
    </div>
  )
}
