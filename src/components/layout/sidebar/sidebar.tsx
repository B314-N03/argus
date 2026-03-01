import { Link } from '@tanstack/react-router'
import {
  Home,
  Radar,
  Waves,
  Radio,
  Activity,
  Headphones,
  X,
} from 'lucide-react'
import styles from './sidebar.module.scss'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const mainNavItems = [
  { to: '/', icon: Home, label: 'Dashboard' },
  { to: '/air', icon: Radar, label: 'Air Activity' },
  { to: '/naval', icon: Waves, label: 'Naval Activity' },
  { to: '/signals', icon: Radio, label: 'Signals' },
  { to: '/indicators', icon: Activity, label: 'Indicators' },
  { to: '/radios', icon: Headphones, label: 'Radios' },
] as const

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`}
        onClick={onClose}
      />
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.header}>
          <span className={styles.title}>Navigation</span>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>
        <nav className={styles.nav}>
          <div className={styles.navSection}>
            <div className={styles.navSectionTitle}>Main</div>
            {mainNavItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={styles.navLink}
                activeProps={{ className: styles.active }}
              >
                <item.icon className={styles.icon} />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </aside>
    </>
  )
}
