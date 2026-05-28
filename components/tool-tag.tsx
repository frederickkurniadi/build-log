import { toolColorClass } from '@/lib/tools'

export function ToolTag({ name }: { name: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${toolColorClass(name)}`}
    >
      {name}
    </span>
  )
}
