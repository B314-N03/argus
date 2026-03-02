// Mock indicators data generator
import type {
  ActivityIndicator,
  IndicatorType,
  TimeWindow,
  TrendDirection,
} from "@/domain/models";

import { createSeededRandom } from "./seed";

const indicatorTypes: IndicatorType[] = [
  "isr_activity",
  "naval_presence",
  "tanker_density",
  "signal_activity",
  "air_activity",
  "anomaly_score",
];

const regions = [
  "north_atlantic",
  "south_china_sea",
  "mediterranean",
  "persian_gulf",
  "indo_pacific",
  "baltic_sea",
  "caribbean",
];

const indicatorNames: Record<IndicatorType, string> = {
  isr_activity: "ISR Activity Index",
  naval_presence: "Naval Presence Index",
  tanker_density: "Tanker Density Score",
  signal_activity: "Signal Activity Index",
  air_activity: "Air Activity Index",
  anomaly_score: "Anomaly Score",
};

function generateHistory(
  random: () => number,
  baseValue: number,
  deviation: number,
): { timestamp: string; value: number; baseline: number }[] {
  const history = [];
  const now = new Date();

  for (let i = 23; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    const variance = (random() - 0.5) * 20;
    const value = baseValue * (1 + (deviation + variance) / 100);

    history.push({
      timestamp: timestamp.toISOString(),
      value: Math.max(0, value),
      baseline: baseValue,
    });
  }

  return history;
}

function generateTrend(deviation: number): TrendDirection {
  if (deviation > 10) return "increasing";
  if (deviation < -10) return "decreasing";

  return "stable";
}

// Pre-generate all 42 indicators (6 types × 7 regions) with seeded random
function buildAllIndicators(timeWindow: TimeWindow): ActivityIndicator[] {
  const indicators: ActivityIndicator[] = [];

  for (const type of indicatorTypes) {
    for (const region of regions) {
      const seed = `${type}_${region}_${timeWindow}`;
      const random = createSeededRandom(seed);

      const deviation = random() * 80 - 30;
      const baseline = 40 + random() * 40;
      const value = baseline * (1 + deviation / 100);
      const confidence = 0.6 + random() * 0.38;

      indicators.push({
        id: `ind_${type}_${region}_${timeWindow}`,
        name: indicatorNames[type],
        type,
        value: Math.round(value * 10) / 10,
        baseline: Math.round(baseline * 10) / 10,
        deviation: Math.round(deviation * 10) / 10,
        confidence: Math.round(confidence * 100) / 100,
        timeWindow,
        region,
        updatedAt: new Date().toISOString(),
        trend: generateTrend(deviation),
        history: generateHistory(random, baseline, deviation),
      });
    }
  }

  return indicators;
}

// Generate mock indicators with filtering
export function generateMockIndicators(
  count: number = 42,
  params?: { region?: string; type?: string; timeWindow?: TimeWindow },
): ActivityIndicator[] {
  const timeWindow = params?.timeWindow ?? "24h";
  let indicators = buildAllIndicators(timeWindow);

  if (params?.region) {
    indicators = indicators.filter((ind) => ind.region === params.region);
  }

  if (params?.type) {
    indicators = indicators.filter((ind) => ind.type === params.type);
  }

  return indicators.slice(0, count);
}

// Derive 24-hour tension history from indicator history data
export function generateTensionHistory(
  indicators: ActivityIndicator[],
): { timestamp: string; value: number }[] {
  if (!indicators.length) return [];

  // Each indicator has 24 history points (hourly)
  const historyLength = indicators[0].history?.length ?? 0;

  if (historyLength === 0) return [];

  const points: { timestamp: string; value: number }[] = [];

  for (let i = 0; i < historyLength; i++) {
    let sumDeviation = 0;
    let elevatedCount = 0;
    let anomalousCount = 0;
    let count = 0;

    for (const ind of indicators) {
      const point = ind.history?.[i];

      if (!point) continue;

      const deviation =
        point.baseline > 0
          ? ((point.value - point.baseline) / point.baseline) * 100
          : 0;

      sumDeviation += Math.abs(deviation);
      if (deviation > 15) elevatedCount++;
      if (deviation > 30) anomalousCount++;
      count++;
    }

    const avgDeviation = count > 0 ? sumDeviation / count : 0;
    const deviationComponent = Math.min(avgDeviation * 1.5, 40);
    const elevatedComponent = Math.min(elevatedCount * 3, 30);
    const anomalousComponent = Math.min(anomalousCount * 5, 30);
    const value = Math.round(
      deviationComponent + elevatedComponent + anomalousComponent,
    );

    const timestamp =
      indicators[0].history?.[i]?.timestamp ?? new Date().toISOString();

    points.push({ timestamp, value: Math.min(value, 100) });
  }

  return points;
}

// Calculate summary statistics
export function calculateIndicatorsSummary(indicators: ActivityIndicator[]): {
  totalIndicators: number;
  elevatedCount: number;
  anomalousCount: number;
  averageDeviation: number;
} {
  const elevatedCount = indicators.filter((i) => i.deviation > 15).length;
  const anomalousCount = indicators.filter((i) => i.deviation > 30).length;
  const averageDeviation =
    indicators.length > 0
      ? indicators.reduce((sum, i) => sum + i.deviation, 0) / indicators.length
      : 0;

  return {
    totalIndicators: indicators.length,
    elevatedCount,
    anomalousCount,
    averageDeviation: Math.round(averageDeviation * 10) / 10,
  };
}
