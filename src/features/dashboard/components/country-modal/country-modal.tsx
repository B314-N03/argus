import { Dialog } from '@/components/ui/dialog/dialog'
import type { Country } from '@/domain/models'
import type { NewsItem } from '@/domain/models'
import styles from './country-modal.module.scss'

interface CountryModalProps {
  country: Country | null
  newsItems: NewsItem[]
  onClose: () => void
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return n.toString()
}

export function CountryModal({ country, newsItems, onClose }: CountryModalProps) {
  if (!country) return null

  const filteredNews = newsItems.filter(
    (item) => item.region && country.region && item.region === country.region,
  )

  return (
    <Dialog open={!!country} onClose={onClose} title={country.name} size="lg">
      <div className={styles.sections}>
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Overview</h4>
          <div className={styles.grid}>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Capital</span>
              <span className={styles.fieldValue}>{country.capital ?? '—'}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Population</span>
              <span className={styles.fieldValue}>
                {country.population ? formatNumber(country.population) : '—'}
              </span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Government Type</span>
              <span className={styles.fieldValue}>{country.governmentType}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Region</span>
              <span className={styles.fieldValue}>{country.region.replace(/_/g, ' ')}</span>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Leadership</h4>
          <div className={styles.grid}>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Head of State</span>
              <span className={styles.fieldValue}>{country.headOfState}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Head of Government</span>
              <span className={styles.fieldValue}>{country.headOfGovernment}</span>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Military</h4>
          <div className={styles.grid}>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Active Personnel</span>
              <span className={styles.fieldValueLarge}>
                {country.activePersonnel ? formatNumber(country.activePersonnel) : '—'}
              </span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Reserve Personnel</span>
              <span className={styles.fieldValueLarge}>
                {country.reservePersonnel ? formatNumber(country.reservePersonnel) : '—'}
              </span>
            </div>
          </div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Branches</span>
            <div className={styles.branchList}>
              {country.militaryBranches.map((branch) => (
                <span key={branch} className={styles.branchBadge}>
                  {branch}
                </span>
              ))}
            </div>
          </div>
          {country.alliances.length > 0 && (
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Alliances</span>
              <div className={styles.allianceList}>
                {country.alliances.map((alliance) => (
                  <span key={alliance} className={styles.allianceBadge}>
                    {alliance}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Regional Activity</h4>
          {filteredNews.length > 0 ? (
            <div className={styles.newsSection}>
              {filteredNews.slice(0, 5).map((item) => (
                <div key={item.id} className={styles.newsItem}>
                  <div className={styles.newsSource}>{item.source}</div>
                  {item.content}
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.noData}>No recent regional activity reported.</p>
          )}
        </div>
      </div>
    </Dialog>
  )
}
