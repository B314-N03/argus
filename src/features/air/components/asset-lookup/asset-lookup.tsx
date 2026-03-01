import { useState } from 'react'
import { Search } from 'lucide-react'
import { useAircraftAssets } from '../../hooks/use-aircraft-assets'
import { AssetCard } from '../asset-card/asset-card'
import styles from './asset-lookup.module.scss'

export function AssetLookup() {
  const [search, setSearch] = useState('')
  const { data: assets, isLoading } = useAircraftAssets(search || undefined)

  return (
    <div className={styles.container}>
      <div className={styles.searchBar}>
        <Search size={16} className={styles.searchIcon} />
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search by designation, name, role, or operator..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className={styles.loading}>Loading assets...</div>
      ) : (
        <div className={styles.grid}>
          {assets?.map((asset) => <AssetCard key={asset.id} asset={asset} />)}
        </div>
      )}

      {!isLoading && assets?.length === 0 && (
        <div className={styles.empty}>No aircraft assets match your search.</div>
      )}
    </div>
  )
}
