import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { BuildStatus } from '@/lib/types'

const STYLES: Record<BuildStatus, string> = {
  'Shipped': 'bg-primary/10 text-primary border-primary/20',
  'In Progress': 'bg-amber-50 text-amber-700 border-amber-200',
  'Planning': 'bg-blue-50 text-blue-700 border-blue-200',
  'Archived': 'bg-muted text-muted-foreground border-border',
}

export function StatusBadge({ status, className }: { status: BuildStatus; className?: string }) {
  return <Badge className={cn(STYLES[status], className)}>{status}</Badge>
}
