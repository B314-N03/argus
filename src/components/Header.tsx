import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Menu, Eye, Bell, Search } from 'lucide-react'
import Sidebar from './layout/Sidebar'
import styles from './Header.module.scss'

export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logo}>
          <button
            className={styles.menuButton}
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <div className={styles.logoIcon}>
              <Eye size={20} color="white" />
            </div>
            <h1 className={styles.logoText}>
              ARGUS
              <span className={styles.logoSubtext}>OSINT Dashboard</span>
            </h1>
          </Link>
        </div>

        <div className={styles.actions}>
          <div className={styles.statusIndicator}>
            <span className={styles.statusDot} />
            Live
          </div>
          <button className={styles.actionButton} aria-label="Search">
            <Search size={20} />
          </button>
          <button className={styles.actionButton} aria-label="Notifications">
            <Bell size={20} />
          </button>
        </div>
      </header>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  )
}
