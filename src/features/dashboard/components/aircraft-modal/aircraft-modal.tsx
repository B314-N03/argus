import { Dialog } from "@/components/ui/dialog/dialog";
import type { Aircraft } from "@/domain/models";
import { getAircraftCategoryLabel } from "@/domain/models";

import styles from "./aircraft-modal.module.scss";

interface AircraftModalProps {
  aircraft: Aircraft | null;
  onClose: () => void;
}

function formatAltitude(alt: number | null): string {
  if (alt === null) return "—";

  return `${alt.toLocaleString()} ft`;
}

function formatSpeed(speed: number | null): string {
  if (speed === null) return "—";

  return `${speed.toLocaleString()} kts`;
}

export const AircraftModal = ({ aircraft, onClose }: AircraftModalProps) => {
  if (!aircraft) return null;

  const categoryLabel = getAircraftCategoryLabel(aircraft.category);

  return (
    <Dialog
      open={!!aircraft}
      onClose={onClose}
      title={`${categoryLabel} Aircraft`}
      size="md"
    >
      <div className={styles.content}>
        <div className={styles.imageSection}>
          <div className={styles.imagePlaceholder}>
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
            </svg>
            <span className={styles.imageLabel}>Aircraft Image</span>
          </div>
        </div>

        <div className={styles.details}>
          <div className={styles.callsign}>
            {aircraft.callsign ?? "No Callsign"}
          </div>

          <div className={styles.grid}>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>ICAO24</span>
              <span className={styles.fieldValue}>{aircraft.icao24}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Registration</span>
              <span className={styles.fieldValue}>
                {aircraft.registration ?? "—"}
              </span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Aircraft Type</span>
              <span className={styles.fieldValue}>{aircraft.type ?? "—"}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Category</span>
              <span className={styles.fieldValue}>{categoryLabel}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Origin Country</span>
              <span className={styles.fieldValue}>{aircraft.originCountry}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Altitude</span>
              <span className={styles.fieldValue}>
                {formatAltitude(aircraft.altitude)}
              </span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Ground Speed</span>
              <span className={styles.fieldValue}>
                {formatSpeed(aircraft.velocity?.speed ?? null)}
              </span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Last Seen</span>
              <span className={styles.fieldValue}>
                {new Date(aircraft.lastSeen).toLocaleString()}
              </span>
            </div>
          </div>

          <div className={styles.position}>
            <span className={styles.positionLabel}>Position</span>
            <span className={styles.positionValue}>
              {aircraft.position.latitude.toFixed(4)}°,{" "}
              {aircraft.position.longitude.toFixed(4)}°
            </span>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
