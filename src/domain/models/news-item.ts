export type NewsSourceType = 'twitter' | 'news' | 'telegram' | 'forum'

export interface NewsItem {
  id: string
  source: string
  sourceType: NewsSourceType
  author?: string
  content: string
  url?: string
  timestamp: string
  tags: string[]
  region?: string
}
