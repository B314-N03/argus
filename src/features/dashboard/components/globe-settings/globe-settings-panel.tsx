import clsx from "clsx";

import type { GlobeSettings } from "@/lib/settings";
import { DEFAULT_GLOBE_SETTINGS } from "@/lib/settings";

import { ATMOSPHERE_COLORS } from "./globe-settings-constants";
import styles from "./globe-settings-panel.module.scss";

interface GlobeSettingsPanelProps {
  settings: GlobeSettings;
  onChange: (settings: GlobeSettings) => void;
  onClose: () => void;
}

const TEXTURE_OPTIONS: { value: GlobeSettings["texture"]; label: string }[] = [
  { value: "night", label: "Night" },
  { value: "day", label: "Day" },
  { value: "blue-marble", label: "Marble" },
  { value: "topology", label: "Topo" },
];

const BACKGROUND_OPTIONS: {
  value: GlobeSettings["background"];
  label: string;
}[] = [
  { value: "night-sky", label: "Stars" },
  { value: "dark", label: "Dark" },
];

const ALTITUDE_OPTIONS: {
  value: GlobeSettings["atmosphereAltitude"];
  label: string;
}[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Med" },
  { value: "high", label: "High" },
];

const COLOR_OPTIONS: {
  value: GlobeSettings["atmosphereColor"];
  label: string;
}[] = [
  { value: "blue", label: "Blue" },
  { value: "cyan", label: "Cyan" },
  { value: "green", label: "Green" },
  { value: "orange", label: "Orange" },
];

function update<K extends keyof GlobeSettings>(
  settings: GlobeSettings,
  key: K,
  value: GlobeSettings[K],
): GlobeSettings {
  return { ...settings, [key]: value };
}

export const GlobeSettingsPanel = ({
  settings,
  onChange,
  onClose,
}: GlobeSettingsPanelProps) => {
  const isDefault =
    JSON.stringify(settings) === JSON.stringify(DEFAULT_GLOBE_SETTINGS);

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.panel}>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Surface</div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Texture</span>
            <div className={styles.segmentGroup}>
              {TEXTURE_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  className={clsx(
                    styles.segment,
                    settings.texture === opt.value && styles.segmentActive,
                  )}
                  onClick={() =>
                    onChange(update(settings, "texture", opt.value))
                  }
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Background</span>
            <div className={styles.segmentGroup}>
              {BACKGROUND_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  className={clsx(
                    styles.segment,
                    settings.background === opt.value && styles.segmentActive,
                  )}
                  onClick={() =>
                    onChange(update(settings, "background", opt.value))
                  }
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Atmosphere</div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Glow</span>
            <button
              type="button"
              className={clsx(
                styles.toggle,
                settings.showAtmosphere && styles.toggleActive,
              )}
              onClick={() =>
                onChange(
                  update(settings, "showAtmosphere", !settings.showAtmosphere),
                )
              }
              aria-label="Toggle atmosphere"
            />
          </div>
          {settings.showAtmosphere && (
            <>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Color</span>
                <div className={styles.swatchGroup}>
                  {COLOR_OPTIONS.map((opt) => (
                    <button
                      type="button"
                      key={opt.value}
                      className={clsx(
                        styles.swatch,
                        settings.atmosphereColor === opt.value &&
                          styles.swatchActive,
                      )}
                      style={
                        {
                          "--swatch-color": ATMOSPHERE_COLORS[opt.value],
                        } as React.CSSProperties
                      }
                      onClick={() =>
                        onChange(update(settings, "atmosphereColor", opt.value))
                      }
                      aria-label={opt.label}
                      title={opt.label}
                    />
                  ))}
                </div>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Height</span>
                <div className={styles.segmentGroup}>
                  {ALTITUDE_OPTIONS.map((opt) => (
                    <button
                      type="button"
                      key={opt.value}
                      className={clsx(
                        styles.segment,
                        settings.atmosphereAltitude === opt.value &&
                          styles.segmentActive,
                      )}
                      onClick={() =>
                        onChange(
                          update(settings, "atmosphereAltitude", opt.value),
                        )
                      }
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Display</div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Grid lines</span>
            <button
              type="button"
              className={clsx(
                styles.toggle,
                settings.showGraticules && styles.toggleActive,
              )}
              onClick={() =>
                onChange(
                  update(settings, "showGraticules", !settings.showGraticules),
                )
              }
              aria-label="Toggle grid lines"
            />
          </div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Animate on load</span>
            <button
              type="button"
              className={clsx(
                styles.toggle,
                settings.animateIn && styles.toggleActive,
              )}
              onClick={() =>
                onChange(update(settings, "animateIn", !settings.animateIn))
              }
              aria-label="Toggle animate on load"
            />
          </div>
        </div>

        {!isDefault && (
          <button
            type="button"
            className={styles.resetButton}
            onClick={() => onChange(DEFAULT_GLOBE_SETTINGS)}
          >
            Reset to defaults
          </button>
        )}
      </div>
    </>
  );
};
