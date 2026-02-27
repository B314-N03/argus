import type { ReactNode } from 'react'
import styles from './MainLayout.module.scss'

interface MainLayoutProps {
  children: ReactNode
  showSidebar?: boolean
  className?: string
}

export default function MainLayout({
  children,
  showSidebar = true,
  className = '',
}: MainLayoutProps) {
  return (
    <div className={`${styles.container} ${showSidebar ? styles.withSidebar : ''} ${className}`}>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  )
}
