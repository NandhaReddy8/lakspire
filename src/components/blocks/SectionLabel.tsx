import { cn } from '@/lib/utils'

interface SectionLabelProps {
  children: React.ReactNode
  className?: string
}

export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <p
      className={cn(
        'text-[13px] font-bold uppercase text-[#FF6B35]',
        className
      )}
      style={{ letterSpacing: '0.14em' }}
    >
      {children}
    </p>
  )
}
