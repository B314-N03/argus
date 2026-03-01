import { useState, useRef, useEffect } from 'react'
import styles from './info-tooltip.module.scss'

interface InfoTooltipProps {
  content: string
}

export function InfoTooltip({ content }: InfoTooltipProps) {
  const [visible, setVisible] = useState(false)
  const [position, setPosition] = useState<'top' | 'bottom'>('top')
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (visible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      // If too close to the top, show tooltip below
      setPosition(rect.top < 120 ? 'bottom' : 'top')
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
      {visible && (
        <span className={`${styles.tooltip} ${styles[position]}`} role="tooltip">
          {content}
        </span>
      )}
    </span>
  )
}
