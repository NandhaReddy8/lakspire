import { cn } from '@/lib/utils'

interface SectionLabelProps {
  children: React.ReactNode
  className?: string
  color?: 'accent' | 'teal' | 'muted'
}

export function SectionLabel({ children, className, color = 'accent' }: SectionLabelProps) {
  const colors = {
    accent: 'text-[#F4A261]',
    teal: 'text-[#E9C46A]',
    muted: 'text-white/40',
  }
  return (
    <p
      className={cn(
        'text-[11px] font-semibold uppercase',
        colors[color],
        className
      )}
      style={{ letterSpacing: '0.12em' }}
    >
      {children}
    </p>
  )
}
