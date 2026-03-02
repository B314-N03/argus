import { useMemo, useState, useCallback, useRef, useEffect } from "react";

import { createFileRoute } from "@tanstack/react-router";

import { GlobeLayout } from "@/components/layout/globe-layout/globe-layout";
import type { NewsItem, Country } from "@/domain/models";
import {
  GlobeView,
  ActivityFeed,
  NewsFeed,
  TensionIndex,
  DashboardHeader,
  WidgetStack,
  CountryModal,
  NewsDetailModal,
  useGlobeData,
} from "@/features/dashboard";
import { findCountryByName } from "@/lib/api/mock/countries";
import { generateTensionHistory } from "@/lib/api/mock/indicators";
import { mockNewsItems } from "@/lib/api/mock/news";
import {
  useSettings,
  SETTINGS_KEYS,
  DEFAULT_FEED_SPLIT_STATE,
} from "@/lib/settings";
import type { FeedSplitState } from "@/lib/settings";

import styles from "./index.module.scss";

const DashboardPage = () => {
  const {
    aircraftPoints,
    vesselPoints,
    signalPoints,
    zones,
    countries,
    indicators,
    vessels,
    signals,
  } = useGlobeData();

  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedNewsItem, setSelectedNewsItem] = useState<NewsItem | null>(
    null,
  );

  const [feedSplit, setFeedSplit] = useSettings<FeedSplitState>(
    SETTINGS_KEYS.FEED_SPLIT,
    DEFAULT_FEED_SPLIT_STATE,
  );
  const feedSplitRef = useRef(feedSplit);

  useEffect(() => {
    feedSplitRef.current = feedSplit;
  }, [feedSplit]);

  const [dragRatio, setDragRatio] = useState<number | null>(null);
  const dragRatioRef = useRef(dragRatio);

  useEffect(() => {
    dragRatioRef.current = dragRatio;
  }, [dragRatio]);

  const containerRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);
  const startRatioRef = useRef(0);

  const handleDividerPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      startYRef.current = e.clientY;
      startRatioRef.current = feedSplitRef.current.topRatio;

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const container = containerRef.current;

        if (!container) return;
        const containerHeight = container.clientHeight;

        if (containerHeight === 0) return;

        const dy = moveEvent.clientY - startYRef.current;
        const deltaRatio = dy / containerHeight;
        const newRatio = Math.max(
          0.1,
          Math.min(0.9, startRatioRef.current + deltaRatio),
        );

        setDragRatio(newRatio);
      };

      const handlePointerUp = () => {
        const finalRatio = dragRatioRef.current;

        if (finalRatio !== null) {
          setFeedSplit({ ...feedSplitRef.current, topRatio: finalRatio });
        }

        setDragRatio(null);
        document.removeEventListener("pointermove", handlePointerMove);
        document.removeEventListener("pointerup", handlePointerUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };

      document.body.style.cursor = "row-resize";
      document.body.style.userSelect = "none";
      document.addEventListener("pointermove", handlePointerMove);
      document.addEventListener("pointerup", handlePointerUp);
    },
    [setFeedSplit],
  );

  const toggleTopCollapse = useCallback(() => {
    setFeedSplit({
      ...feedSplitRef.current,
      topCollapsed: !feedSplitRef.current.topCollapsed,
    });
  }, [setFeedSplit]);

  const toggleBottomCollapse = useCallback(() => {
    setFeedSplit({
      ...feedSplitRef.current,
      bottomCollapsed: !feedSplitRef.current.bottomCollapsed,
    });
  }, [setFeedSplit]);

  const tensionValue = useMemo(() => {
    if (!indicators?.summary) return 35;
    const { averageDeviation, elevatedCount, anomalousCount } =
      indicators.summary;
    const deviationComponent = Math.min(Math.abs(averageDeviation) * 1.5, 40);
    const elevatedComponent = Math.min(elevatedCount * 3, 30);
    const anomalousComponent = Math.min(anomalousCount * 5, 30);

    return Math.round(
      deviationComponent + elevatedComponent + anomalousComponent,
    );
  }, [indicators]);

  const tensionHistory = useMemo(() => {
    if (!indicators?.indicators) return undefined;

    return generateTensionHistory(indicators.indicators);
  }, [indicators]);

  const totalEntities =
    aircraftPoints.length + vesselPoints.length + signalPoints.length;
  const activeRegions = zones.filter((z) => z.active).length;

  const aircraftForFeed = useMemo(() => {
    return aircraftPoints.map((p) => ({
      id: p.id,
      callsign: p.label,
      icao24: p.id,
      originCountry: "Unknown",
      position: { latitude: p.lat, longitude: p.lng, altitude: 0 },
      velocity: null,
      altitude: null,
      lastSeen: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      category: (p as { category?: string }).category ?? "unknown",
    }));
  }, [aircraftPoints]);

  const handleCountrySelect = useCallback((name: string) => {
    const country = findCountryByName(name);

    if (country) {
      setSelectedCountry(country);
    }
  }, []);

  const handleNewsItemClick = useCallback((item: NewsItem) => {
    setSelectedNewsItem(item);
  }, []);

  const { topCollapsed, bottomCollapsed, topRatio } = feedSplit;
  const effectiveRatio = dragRatio ?? topRatio;
  const topFlex = topCollapsed ? 0 : effectiveRatio;
  const bottomFlex = bottomCollapsed ? 0 : 1 - effectiveRatio;

  return (
    <>
      <GlobeLayout
        header={(
          <DashboardHeader
            activeRegions={activeRegions}
            totalEntities={totalEntities}
          />
        )}
        left={(
          <div className={styles.leftColumn} ref={containerRef}>
            <div
              className={styles.feedSection}
              style={{ flex: topCollapsed ? "0 0 auto" : topFlex }}
            >
              <NewsFeed
                items={mockNewsItems}
                onItemClick={handleNewsItemClick}
                collapsed={topCollapsed}
                onToggleCollapse={toggleTopCollapse}
              />
            </div>
            <div
              className={styles.feedDivider}
              onPointerDown={handleDividerPointerDown}
            >
              Activity
            </div>
            <div
              className={styles.feedSection}
              style={{ flex: bottomCollapsed ? "0 0 auto" : bottomFlex }}
            >
              <ActivityFeed
                aircraft={aircraftForFeed as never[]}
                vessels={vessels}
                signals={signals}
                collapsed={bottomCollapsed}
                onToggleCollapse={toggleBottomCollapse}
              />
            </div>
          </div>
        )}
        center={(
          <>
            <GlobeView
              aircraftPoints={aircraftPoints}
              vesselPoints={vesselPoints}
              signalPoints={signalPoints}
              zones={zones}
              countries={countries}
              onCountrySelect={handleCountrySelect}
            />
            <TensionIndex value={tensionValue} history={tensionHistory} />
          </>
        )}
        right={(
          <WidgetStack
            indicatorData={indicators}
            aircraftCount={aircraftPoints.length}
            vesselCount={vesselPoints.length}
            signalCount={signalPoints.length}
            aircraftPoints={aircraftPoints}
            vesselPoints={vesselPoints}
          />
        )}
      />
      <CountryModal
        country={selectedCountry}
        newsItems={mockNewsItems}
        onClose={() => setSelectedCountry(null)}
      />
      <NewsDetailModal
        item={selectedNewsItem}
        onClose={() => setSelectedNewsItem(null)}
      />
    </>
  );
};

export const Route = createFileRoute("/")({
  component: DashboardPage,
});
