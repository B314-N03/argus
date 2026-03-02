import { useState } from "react";

import { Radar, Waves, Radio, Activity, Settings } from "lucide-react";

import { Card } from "@/components/ui/card/card";
import { InfoTooltip } from "@/components/ui/info-tooltip/info-tooltip";
import { RadioDashboardCard } from "@/features/radios";
import type { GetIndicatorsResponse } from "@/lib/api/types";
import {
  useSettings,
  SETTINGS_KEYS,
  DEFAULT_WIDGET_VISIBILITY,
} from "@/lib/settings";
import type { WidgetVisibility } from "@/lib/settings";
import { tooltipContent } from "@/lib/tooltip-content";

import { ChokepointWidget } from "../chokepoint-widget/chokepoint-widget";
import { ForceSummary } from "../force-summary/force-summary";
import type { GlobePoint } from "../globe-view/globe-view";
import { WidgetSettings } from "../widget-settings/widget-settings";

import styles from "./widget-stack.module.scss";

interface WidgetStackProps {
  indicatorData: GetIndicatorsResponse | undefined;
  aircraftCount: number;
  vesselCount: number;
  signalCount: number;
  aircraftPoints?: GlobePoint[];
  vesselPoints?: GlobePoint[];
}

export const WidgetStack = ({
  indicatorData,
  aircraftCount,
  vesselCount,
  signalCount,
  aircraftPoints = [],
  vesselPoints = [],
}: WidgetStackProps) => {
  const [visibility, setVisibility] = useSettings<WidgetVisibility>(
    SETTINGS_KEYS.VISIBLE_WIDGETS,
    DEFAULT_WIDGET_VISIBILITY,
  );
  const [showSettings, setShowSettings] = useState(false);

  const summary = indicatorData?.summary;

  return (
    <div className={styles.stack}>
      <div className={styles.header}>
        <h3 className={styles.title}>Widgets</h3>
        <div className={styles.settingsWrapper}>
          <button
            type="button"
            className={styles.settingsButton}
            onClick={() => setShowSettings(!showSettings)}
            aria-label="Widget settings"
          >
            <Settings size={14} />
          </button>
          {showSettings && (
            <WidgetSettings
              visibility={visibility}
              onChange={setVisibility}
              onClose={() => setShowSettings(false)}
            />
          )}
        </div>
      </div>

      <div className={styles.widgets}>
        {visibility.radios && <RadioDashboardCard />}

        {visibility.indicators && (
          <Card padding="sm">
            <div className={styles.widgetHeader}>
              <Activity size={16} className={styles.iconIndicator} />
              <span className={styles.widgetTitle}>Indicator Status</span>
              <InfoTooltip content={tooltipContent.indicators_stat} />
            </div>
            <div className={styles.miniStats}>
              <div className={styles.miniStat}>
                <span className={styles.miniValue}>
                  {summary?.elevatedCount ?? 0}
                </span>
                <span className={styles.miniLabel}>Elevated</span>
              </div>
              <div className={styles.miniStat}>
                <span className={`${styles.miniValue} ${styles.anomalous}`}>
                  {summary?.anomalousCount ?? 0}
                </span>
                <span className={styles.miniLabel}>Anomalous</span>
              </div>
            </div>
          </Card>
        )}

        {visibility.aircraft && (
          <Card padding="sm">
            <div className={styles.widgetHeader}>
              <Radar size={16} className={styles.iconAircraft} />
              <span className={styles.widgetTitle}>Aircraft</span>
              <InfoTooltip content={tooltipContent.air_stat} />
            </div>
            <span className={styles.bigValue}>{aircraftCount}</span>
            <span className={styles.miniLabel}>Tracked</span>
          </Card>
        )}

        {visibility.vessels && (
          <Card padding="sm">
            <div className={styles.widgetHeader}>
              <Waves size={16} className={styles.iconVessel} />
              <span className={styles.widgetTitle}>Vessels</span>
              <InfoTooltip content={tooltipContent.naval_stat} />
            </div>
            <span className={styles.bigValue}>{vesselCount}</span>
            <span className={styles.miniLabel}>Detected</span>
          </Card>
        )}

        {visibility.signals && (
          <Card padding="sm">
            <div className={styles.widgetHeader}>
              <Radio size={16} className={styles.iconSignal} />
              <span className={styles.widgetTitle}>Signals</span>
              <InfoTooltip content={tooltipContent.signals_stat} />
            </div>
            <span className={styles.bigValue}>{signalCount}</span>
            <span className={styles.miniLabel}>Captured</span>
          </Card>
        )}

        {visibility.chokepoints && <ChokepointWidget />}

        {visibility.forceSummary && (
          <ForceSummary
            aircraftPoints={aircraftPoints}
            vesselPoints={vesselPoints}
            signalCount={signalCount}
          />
        )}
      </div>
    </div>
  );
};
