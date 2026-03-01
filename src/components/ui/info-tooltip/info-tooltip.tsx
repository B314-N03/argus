import { useState, useRef, useEffect } from 'react'
import styles from './info-tooltip.module.scss'

interface InfoTooltipProps {
  content: string
}

export function InfoTooltip({ content }: InfoTooltipProps) {
  const [visible, setVisible] = useState(false)
  const [coords, setCoords] = useState<{ top: number; left: number; placement: 'top' | 'bottom' } | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (visible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      const placement = rect.top < 120 ? 'bottom' : 'top'
      setCoords({
        left: rect.left + rect.width / 2,
        top: placement === 'top' ? rect.top - 6 : rect.bottom + 6,
        placement,
      })
    } else {
      setCoords(null)
    }
  }, [visible])

  return (
    <span className={styles.wrapper}>
      <button
        ref={triggerRef}
        className={styles.trigger}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        aria-label="More information"
        type="button"
      >
        i
      </button>
      {visible && coords && (
        <span
          className={`${styles.tooltip} ${styles[coords.placement]}`}
          role="tooltip"
          style={{
            position: 'fixed',
            left: coords.left,
            top: coords.top,
          }}
        >
          {content}
        </span>
      )}
    </span>
  )
}
