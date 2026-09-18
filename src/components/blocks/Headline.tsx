import { cn } from '@/lib/utils'

interface HeadlineProps {
  children: React.ReactNode
  as?: 'h1' | 'h2' | 'h3' | 'h4'
  size?: 'hero' | 'xl' | 'lg' | 'md' | 'sm'
  className?: string
  accent?: string
}

const sizeClasses = {
  hero: 'text-[clamp(2.75rem,2rem+4vw,5rem)] font-[350] leading-[1.08] tracking-[-0.03em]',
  xl: 'text-[clamp(2rem,1.5rem+2.5vw,3.25rem)] font-[350] leading-[1.1] tracking-[-0.03em]',
  lg: 'text-[clamp(1.625rem,1.3rem+1.5vw,2.25rem)] font-[400] leading-[1.15] tracking-[-0.025em]',
  md: 'text-[clamp(1.25rem,1.1rem+0.8vw,1.625rem)] font-[400] leading-[1.25] tracking-[-0.02em]',
  sm: 'text-[1.125rem] font-[500] leading-[1.3] tracking-[-0.015em]',
}

export function Headline({
  children,
  as: Tag = 'h2',
  size = 'xl',
  className,
}: HeadlineProps) {
  return (
    <Tag
      className={cn(
        'font-display text-white/92',
        sizeClasses[size],
        className
      )}
      style={{ fontFamily: 'var(--font-display)' }}
    >
      {children}
    </Tag>
  )
}
