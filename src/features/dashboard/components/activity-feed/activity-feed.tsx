import { useMemo } from "react";

import {
  Radar,
  Waves,
  Radio,
  Activity,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

import type { Aircraft, Vessel, SignalEvent } from "@/domain/models";

import styles from "./activity-feed.module.scss";

interface FeedEvent {
  id: string;
  timestamp: string;
  type: "aircraft" | "vessel" | "signal" | "indicator";
  description: string;
}

interface ActivityFeedProps {
  aircraft: Aircraft[];
  vessels: Vessel[];
  signals: SignalEvent[];
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const ActivityFeed = ({
  aircraft,
  vessels,
  signals,
  collapsed,
  onToggleCollapse,
}: ActivityFeedProps) => {
  const events = useMemo(() => {
    const feed: FeedEvent[] = [];

    aircraft.slice(0, 8).forEach((a) => {
      feed.push({
        id: `feed_${a.id}`,
        timestamp: a.lastSeen,
        type: "aircraft",
        description: `${a.callsign ?? a.icao24} — ${a.category} aircraft from ${a.originCountry}`,
      });
    });

    vessels.slice(0, 6).forEach((v) => {
      feed.push({
        id: `feed_${v.id}`,
        timestamp: v.lastSeen,
        type: "vessel",
        description: `${v.name ?? v.mmsi} — ${v.shipType} vessel (${v.flag})`,
      });
    });

    signals.slice(0, 6).forEach((s) => {
      feed.push({
        id: `feed_${s.id}`,
        timestamp: s.timestamp,
        type: "signal",
        description: `${s.signalType.toUpperCase()} signal from ${s.source}`,
      });
    });

    return feed.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  }, [aircraft, vessels, signals]);

  const IconMap = {
    aircraft: Radar,
    vessel: Waves,
    signal: Radio,
    indicator: Activity,
  };

  return (
    <div className={styles.feed}>
      <div className={styles.header}>
        <h3 className={styles.title}>Activity Feed</h3>
        {onToggleCollapse && (
          <button
            type="button"
            className={styles.collapseButton}
            onClick={onToggleCollapse}
            aria-label={
              collapsed ? "Expand activity feed" : "Collapse activity feed"
            }
          >
            {collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        )}
      </div>
      {!collapsed && (
        <div className={styles.list}>
          {events.map((event) => {
            const Icon = IconMap[event.type];

            return (
              <div key={event.id} className={styles.event}>
                <Icon size={14} className={styles[`icon_${event.type}`]} />
                <div className={styles.content}>
                  <span className={styles.description}>
                    {event.description}
                  </span>
                  <span className={styles.time}>
                    {formatTime(event.timestamp)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

function formatTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);

  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);

  return `${hours}h ago`;
}
