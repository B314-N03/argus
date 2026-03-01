import type { ReactNode } from 'react'
import styles from './main-layout.module.scss'

interface MainLayoutProps {
  children: ReactNode
  className?: string
}

export function MainLayout({
  children,
  className = '',
}: MainLayoutProps) {
  return (
    <div className={`${styles.container} ${className}`}>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  )
}
