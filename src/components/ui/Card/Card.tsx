import type { ReactNode } from 'react'
import styles from './card.module.scss'

interface CardProps {
  children: ReactNode
  interactive?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
}

export function Card({
  children,
  interactive = false,
  padding = 'md',
  className = '',
  onClick,
}: CardProps) {
  const paddingClass = {
    none: styles.paddingNone,
    sm: styles.paddingSm,
    md: '',
    lg: styles.paddingLg,
  }[padding]

  return (
    <div
      className={`${styles.card} ${interactive ? styles.interactive : ''} ${paddingClass} ${className}`}
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
    >
      {children}
    </div>
  )
}
