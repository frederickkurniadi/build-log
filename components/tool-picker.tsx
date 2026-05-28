'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { PRESET_TOOLS, toolColorClass } from '@/lib/tools'

export function ToolPicker({ defaultValue }: { defaultValue?: string[] }) {
  const [selected, setSelected] = useState<string[]>(defaultValue ?? [])
  const [input, setInput] = useState('')

  function toggle(tool: string) {
    setSelected((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool],
    )
  }

  function addCustom() {
    const val = input.trim()
    if (val && !selected.includes(val)) setSelected((prev) => [...prev, val])
    setInput('')
  }

  const customSelected = selected.filter((t) => !PRESET_TOOLS.includes(t))

  return (
    <div className="space-y-3">
      <input type="hidden" name="tools_used" value={selected.join(', ')} />

      <div className="flex flex-wrap gap-1.5">
        {PRESET_TOOLS.map((tool) => {
          const active = selected.includes(tool)
          return (
            <button
              key={tool}
              type="button"
              onClick={() => toggle(tool)}
              className={`rounded-md border px-2 py-0.5 text-xs font-medium transition-opacity ${
                active
                  ? toolColorClass(tool)
                  : 'border-border bg-background text-muted-foreground opacity-40 hover:opacity-80'
              }`}
            >
              {tool}
            </button>
          )
        })}
      </div>

      {customSelected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {customSelected.map((tool) => (
            <span
              key={tool}
              className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium ${toolColorClass(tool)}`}
            >
              {tool}
              <button type="button" onClick={() => toggle(tool)} className="hover:opacity-70">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { e.preventDefault(); addCustom() }
          }}
          placeholder="Add custom tool…"
          className="flex-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
        <button
          type="button"
          onClick={addCustom}
          className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted"
        >
          Add
        </button>
      </div>
    </div>
  )
}
