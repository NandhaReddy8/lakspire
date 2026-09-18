import { cn } from '@/lib/utils'
import Link from 'next/link'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

const base = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0908] disabled:pointer-events-none disabled:opacity-40'

const variants = {
  primary: 'bg-[#FF6B35] text-white hover:bg-[#FF8F5C] active:scale-[0.98]',
  secondary: 'border border-white/[0.15] text-white/80 hover:border-white/30 hover:text-white hover:bg-white/[0.04] active:scale-[0.98]',
  ghost: 'text-white/60 hover:text-white hover:bg-white/[0.04]',
}

const sizes = {
  sm: 'h-8 px-3.5 text-[13px] rounded-md',
  md: 'h-10 px-5 text-sm rounded-md',
  lg: 'h-12 px-7 text-[15px] rounded-lg',
}

export function Button({
  children,
  variant = 'secondary',
  size = 'md',
  href,
  className,
  onClick,
  type = 'button',
  disabled,
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className)

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  )
}
