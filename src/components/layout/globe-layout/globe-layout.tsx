import { type ReactNode, useCallback, useRef, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  useSettings,
  SETTINGS_KEYS,
  DEFAULT_SIDEBAR_STATE,
} from '@/lib/settings'
import type { SidebarState } from '@/lib/settings'
import styles from './globe-layout.module.scss'

const MIN_WIDTH = 200
const MAX_WIDTH = 480
const AUTO_COLLAPSE_THRESHOLD = 230

interface GlobeLayoutProps {
  header: ReactNode
  left: ReactNode
  center: ReactNode
  right: ReactNode
}

export function GlobeLayout({ header, left, center, right }: GlobeLayoutProps) {
  const [sidebarState, setSidebarState] = useSettings<SidebarState>(
    SETTINGS_KEYS.SIDEBAR_STATE,
    DEFAULT_SIDEBAR_STATE,
  )

  const stateRef = useRef(sidebarState)
  useEffect(() => {
    stateRef.current = sidebarState
  }, [sidebarState])

  const [dragWidth, setDragWidth] = useState<{ side: 'left' | 'right'; width: number } | null>(null)
  const dragWidthRef = useRef(dragWidth)
  useEffect(() => {
    dragWidthRef.current = dragWidth
  }, [dragWidth])

  const startXRef = useRef(0)
  const startWidthRef = useRef(0)
  const draggingSideRef = useRef<'left' | 'right' | null>(null)

  const handlePointerDown = useCallback(
    (side: 'left' | 'right', e: React.PointerEvent) => {
      e.preventDefault()
      draggingSideRef.current = side
      startXRef.current = e.clientX
      startWidthRef.current = side === 'left' ? stateRef.current.leftWidth : stateRef.current.rightWidth

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const dx = moveEvent.clientX - startXRef.current
        const delta = draggingSideRef.current === 'left' ? dx : -dx
        const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidthRef.current + delta))

        setDragWidth({ side: draggingSideRef.current!, width: newWidth })
      }

      const handlePointerUp = () => {
        const current = dragWidthRef.current
        if (draggingSideRef.current && current) {
          if (current.width <= AUTO_COLLAPSE_THRESHOLD) {
            const collapseKey = draggingSideRef.current === 'left' ? 'leftCollapsed' : 'rightCollapsed'
            setSidebarState({ ...stateRef.current, [collapseKey]: true })
          } else {
            const widthKey = draggingSideRef.current === 'left' ? 'leftWidth' : 'rightWidth'
            setSidebarState({ ...stateRef.current, [widthKey]: current.width })
          }
        }
        setDragWidth(null)
        draggingSideRef.current = null
        document.removeEventListener('pointermove', handlePointerMove)
        document.removeEventListener('pointerup', handlePointerUp)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }

      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
      document.addEventListener('pointermove', handlePointerMove)
      document.addEventListener('pointerup', handlePointerUp)
    },
    [setSidebarState],
  )

  const toggleCollapse = useCallback(
    (side: 'left' | 'right') => {
      const key = side === 'left' ? 'leftCollapsed' : 'rightCollapsed'
      setSidebarState({ ...stateRef.current, [key]: !stateRef.current[key] })
    },
    [setSidebarState],
  )

  const { leftCollapsed, rightCollapsed, leftWidth, rightWidth } = sidebarState
  const effectiveLeftWidth = dragWidth?.side === 'left' ? dragWidth.width : leftWidth
  const effectiveRightWidth = dragWidth?.side === 'right' ? dragWidth.width : rightWidth

  return (
    <div className={styles.layout}>
      <div className={styles.header}>{header}</div>
      <div className={styles.panels}>
        {/* Left panel */}
        {leftCollapsed ? (
          <div className={styles.expandStrip} style={{ order: 0 }}>
            <button
              className={styles.expandButton}
              onClick={() => toggleCollapse('left')}
              aria-label="Expand left panel"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        ) : (
          <aside
            className={styles.leftPanel}
            style={{ width: effectiveLeftWidth }}
          >
            {left}
          </aside>
        )}

        {/* Left drag handle */}
        {!leftCollapsed && (
          <div
            className={styles.dragHandle}
            style={{ order: 1 }}
            onPointerDown={(e) => handlePointerDown('left', e)}
          >
            <button
              className={styles.collapseButton}
              onClick={(e) => { e.stopPropagation(); toggleCollapse('left') }}
              onPointerDown={(e) => e.stopPropagation()}
              aria-label="Collapse left panel"
            >
              <ChevronLeft size={14} />
            </button>
          </div>
        )}

        {/* Center */}
        <main className={styles.centerPanel}>{center}</main>

        {/* Right drag handle */}
        {!rightCollapsed && (
          <div
            className={styles.dragHandle}
            style={{ order: 3 }}
            onPointerDown={(e) => handlePointerDown('right', e)}
          >
            <button
              className={styles.collapseButton}
              onClick={(e) => { e.stopPropagation(); toggleCollapse('right') }}
              onPointerDown={(e) => e.stopPropagation()}
              aria-label="Collapse right panel"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}

        {/* Right panel */}
        {rightCollapsed ? (
          <div className={styles.expandStrip} style={{ order: 4 }}>
            <button
              className={styles.expandButton}
              onClick={() => toggleCollapse('right')}
              aria-label="Expand right panel"
            >
              <ChevronLeft size={14} />
            </button>
          </div>
        ) : (
          <aside
            className={styles.rightPanel}
            style={{ width: effectiveRightWidth }}
          >
            {right}
          </aside>
        )}
      </div>
    </div>
  )
}
