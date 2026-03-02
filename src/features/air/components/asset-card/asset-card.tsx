import type { AircraftAsset } from "@/domain/models";

import styles from "./asset-card.module.scss";

interface AssetCardProps {
  asset: AircraftAsset;
}

export const AssetCard = ({ asset }: AssetCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.designation}>{asset.designation}</h3>
          <span className={styles.name}>
            {asset.name}
            {asset.natoName && asset.natoName !== asset.name && (
              <span className={styles.nato}> (NATO: {asset.natoName})</span>
            )}
          </span>
        </div>
        <span className={styles.roleBadge}>{asset.role}</span>
      </div>

      <p className={styles.description}>{asset.description}</p>

      <div className={styles.specs}>
        <div className={styles.spec}>
          <span className={styles.specLabel}>Speed</span>
          <span className={styles.specValue}>{asset.specs.maxSpeed}</span>
        </div>
        <div className={styles.spec}>
          <span className={styles.specLabel}>Range</span>
          <span className={styles.specValue}>{asset.specs.range}</span>
        </div>
        <div className={styles.spec}>
          <span className={styles.specLabel}>Ceiling</span>
          <span className={styles.specValue}>{asset.specs.ceiling}</span>
        </div>
        <div className={styles.spec}>
          <span className={styles.specLabel}>Crew</span>
          <span className={styles.specValue}>{asset.specs.crew}</span>
        </div>
      </div>

      <div className={styles.meta}>
        <span className={styles.operator}>{asset.operator}</span>
        <span className={styles.country}>{asset.country}</span>
      </div>
    </div>
  );
};
