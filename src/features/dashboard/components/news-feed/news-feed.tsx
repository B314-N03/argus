import { Twitter, Newspaper, MessageCircle, Globe } from 'lucide-react'
import type { NewsItem, NewsSourceType } from '@/domain/models'
import styles from './news-feed.module.scss'

interface NewsFeedProps {
  items: NewsItem[]
  onItemClick?: (item: NewsItem) => void
}

const sourceIcons: Record<NewsSourceType, typeof Twitter> = {
  twitter: Twitter,
  news: Newspaper,
  telegram: MessageCircle,
  forum: Globe,
}

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diff / 60000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function NewsFeed({ items, onItemClick }: NewsFeedProps) {
  return (
    <div className={styles.feed}>
      <div className={styles.header}>
        <h3 className={styles.title}>OSINT Feed</h3>
      </div>
      <div className={styles.list}>
        {items.map((item) => {
          const Icon = sourceIcons[item.sourceType]
          return (
            <div
              key={item.id}
              className={styles.item}
              role={onItemClick ? 'button' : undefined}
              tabIndex={onItemClick ? 0 : undefined}
              onClick={onItemClick ? () => onItemClick(item) : undefined}
              onKeyDown={
                onItemClick
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        onItemClick(item)
                      }
                    }
                  : undefined
              }
            >
              <div className={styles.iconWrapper}>
                <Icon size={14} />
              </div>
              <div className={styles.content}>
                <div className={styles.sourceLine}>
                  <span className={styles.source}>{item.source}</span>
                  <span className={styles.time}>{formatRelativeTime(item.timestamp)}</span>
                </div>
                <p className={styles.text}>{item.content}</p>
                {item.tags.length > 0 && (
                  <div className={styles.tags}>
                    {item.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className={styles.tag}>
                        {tag.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
