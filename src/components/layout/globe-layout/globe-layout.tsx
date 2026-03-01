import type { ReactNode } from 'react'
import styles from './globe-layout.module.scss'

interface GlobeLayoutProps {
  header: ReactNode
  left: ReactNode
  center: ReactNode
  right: ReactNode
}

export function GlobeLayout({ header, left, center, right }: GlobeLayoutProps) {
  return (
    <div className={styles.layout}>
      <div className={styles.header}>{header}</div>
      <div className={styles.panels}>
        <aside className={styles.leftPanel}>{left}</aside>
        <main className={styles.centerPanel}>{center}</main>
        <aside className={styles.rightPanel}>{right}</aside>
      </div>
    </div>
  )
}
