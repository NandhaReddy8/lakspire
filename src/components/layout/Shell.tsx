import { cn } from '@/lib/utils'

interface ShellProps {
  children: React.ReactNode
  className?: string
  as?: React.ElementType
}

export function Shell({ children, className, as: Tag = 'div' }: ShellProps) {
  return (
    <Tag
      className={cn(
        'mx-auto w-full max-w-container container-pad',
        className
      )}
    >
      {children}
    </Tag>
  )
}
