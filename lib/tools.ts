export const PRESET_TOOLS = [
  'Claude Code', 'Claude API', 'ChatGPT', 'Cursor', 'v0',
  'Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'shadcn/ui',
  'Supabase', 'PostgreSQL', 'Prisma', 'Node.js', 'Python',
  'Vercel', 'Railway', 'GitHub', 'Docker',
]

const COLORS = [
  'bg-blue-50 text-blue-700 border-blue-200',
  'bg-violet-50 text-violet-700 border-violet-200',
  'bg-green-50 text-green-700 border-green-200',
  'bg-orange-50 text-orange-700 border-orange-200',
  'bg-pink-50 text-pink-700 border-pink-200',
  'bg-teal-50 text-teal-700 border-teal-200',
  'bg-amber-50 text-amber-700 border-amber-200',
  'bg-red-50 text-red-700 border-red-200',
  'bg-indigo-50 text-indigo-700 border-indigo-200',
  'bg-cyan-50 text-cyan-700 border-cyan-200',
]

export function toolColorClass(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0
  }
  return COLORS[hash % COLORS.length]
}
