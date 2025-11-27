import { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'custom'
  color?: string
  className?: string
}

export function Badge({ children, variant = 'default', color, className = '' }: BadgeProps) {
  if (variant === 'custom' && color) {
    return (
      <span
        className={`badge ${className}`}
        style={{ backgroundColor: `${color}20`, color }}
      >
        {children}
      </span>
    )
  }

  const variantClasses = {
    default: 'badge-default',
    success: 'badge-success',
    warning: 'badge-warning',
    custom: 'badge-default',
  }

  return (
    <span className={`${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  )
}
