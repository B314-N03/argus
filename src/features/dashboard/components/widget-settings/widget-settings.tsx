import clsx from 'clsx'
import type { WidgetVisibility } from '@/lib/settings'
import styles from './widget-settings.module.scss'

interface WidgetSettingsProps {
  visibility: WidgetVisibility
  onChange: (visibility: WidgetVisibility) => void
  onClose: () => void
}

const WIDGET_LABELS: { key: keyof WidgetVisibility; label: string }[] = [
  { key: 'radios', label: 'Radio Stations' },
  { key: 'indicators', label: 'Indicator Status' },
  { key: 'aircraft', label: 'Aircraft' },
  { key: 'vessels', label: 'Vessels' },
  { key: 'signals', label: 'Signals' },
  { key: 'chokepoints', label: 'Chokepoints' },
  { key: 'forceSummary', label: 'Force Disposition' },
]

export function WidgetSettings({ visibility, onChange, onClose }: WidgetSettingsProps) {
  function toggle(key: keyof WidgetVisibility) {
    onChange({ ...visibility, [key]: !visibility[key] })
  }

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.popover}>
        <div className={styles.title}>Visible Widgets</div>
        <div className={styles.list}>
          {WIDGET_LABELS.map(({ key, label }) => (
            <div key={key} className={styles.item}>
              <span className={styles.label}>{label}</span>
              <button
                className={clsx(styles.toggle, visibility[key] && styles.toggleActive)}
                onClick={() => toggle(key)}
                aria-label={`Toggle ${label}`}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
