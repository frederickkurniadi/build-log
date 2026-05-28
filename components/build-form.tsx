'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { BUILD_STATUSES, type Build } from '@/lib/types'
import { ToolPicker } from '@/components/tool-picker'
import { Plus } from 'lucide-react'

type Action = (formData: FormData) => void | Promise<void>

export function BuildForm({
  action,
  initial,
  triggerLabel = 'New build',
  triggerVariant = 'default',
  title,
  description,
  defaultOpen = false,
}: {
  action: Action
  initial?: Partial<Build>
  triggerLabel?: string
  triggerVariant?: 'default' | 'outline' | 'ghost'
  title: string
  description?: string
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={triggerVariant} size="sm">
          {!initial && <Plus className="h-4 w-4" />}
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <form action={action} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                required
                defaultValue={initial?.date ?? new Date().toISOString().slice(0, 10)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="status">Status</Label>
              <Select id="status" name="status" defaultValue={initial?.status ?? 'In Progress'}>
                {BUILD_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="project_name">Project name</Label>
            <Input id="project_name" name="project_name" required defaultValue={initial?.project_name ?? ''} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="category">Category</Label>
              <Input id="category" name="category" placeholder="Web app, tool, …" defaultValue={initial?.category ?? ''} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="time_spent">Time spent</Label>
              <Input id="time_spent" name="time_spent" placeholder="2h 30m" defaultValue={initial?.time_spent ?? ''} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Tools used</Label>
            <ToolPicker defaultValue={initial?.tools_used ?? []} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="learning">Learning</Label>
            <Textarea
              id="learning"
              name="learning"
              rows={3}
              placeholder="What did you learn?"
              defaultValue={initial?.learning ?? ''}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="live_link">Live link</Label>
              <Input id="live_link" name="live_link" type="url" placeholder="https://…" defaultValue={initial?.live_link ?? ''} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="repo">Repo</Label>
              <Input id="repo" name="repo" type="url" placeholder="https://github.com/…" defaultValue={initial?.repo ?? ''} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="thumbnail">Thumbnail</Label>
            <Input id="thumbnail" name="thumbnail" type="file" accept="image/*" />
            {initial?.thumbnail_url && (
              <p className="text-xs text-muted-foreground">Leave empty to keep the existing image.</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <DialogClose asChild>
              <Button type="button" variant="ghost">Cancel</Button>
            </DialogClose>
            <Button type="submit">{initial ? 'Save changes' : 'Add build'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
