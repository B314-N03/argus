import { useState } from 'react'
import { Headphones } from 'lucide-react'
import type { RadioStation } from '@/domain/models'
import { formatKHz } from '@/domain/models'
import { SignalWaveform } from '../signal-waveform/signal-waveform'
import styles from './radio-station-card.module.scss'

interface RadioStationCardProps {
  station: RadioStation
}

export function RadioStationCard({ station }: RadioStationCardProps) {
  const [isListening, setIsListening] = useState(false)

  const statusClass = {
    active: styles.statusActive,
    inactive: styles.statusInactive,
    intermittent: styles.statusIntermittent,
    unknown: styles.statusUnknown,
  }[station.status]

  const lastSeenLabel = formatLastSeen(station.lastActivity)
  const isActive = station.status === 'active' || station.status === 'intermittent'

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <span className={`${styles.statusDot} ${statusClass}`} />
          <h3 className={styles.name}>{station.name}</h3>
        </div>
        <span className={styles.modeBadge}>{station.mode}</span>
      </div>

      <div className={styles.frequency}>{formatKHz(station.frequency)}</div>

      <div className={styles.waveformRow}>
        <SignalWaveform pattern={station.signalPattern} isActive={isActive} />
      </div>

      <p className={styles.description}>{station.description}</p>

      <div className={styles.activityBar}>
        <div className={styles.activityLabel}>
          <span>Activity</span>
          <span>{station.activityLevel}%</span>
        </div>
        <div className={styles.activityTrack}>
          <div
            className={styles.activityFill}
            style={{ width: `${station.activityLevel}%` }}
          />
        </div>
      </div>

      {station.webSdrUrl && (
        <button
          className={`${styles.listenButton} ${isListening ? styles.listenButtonActive : ''}`}
          onClick={() => setIsListening(!isListening)}
          type="button"
        >
          <Headphones size={14} />
          {isListening ? 'Close Listener' : 'Listen Live'}
        </button>
      )}

      {isListening && station.webSdrUrl && (
        <div className={styles.iframeContainer}>
          <iframe
            className={styles.iframe}
            src={station.webSdrUrl}
            title={`WebSDR - ${station.name}`}
            allow="autoplay"
            sandbox="allow-scripts allow-same-origin allow-popups"
          />
        </div>
      )}

      <div className={styles.meta}>
        <span className={styles.country}>{station.country}</span>
        <span className={styles.lastSeen}>{lastSeenLabel}</span>
      </div>
    </div>
  )
}

function formatLastSeen(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const hours = Math.floor(diff / 3600000)

  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}
