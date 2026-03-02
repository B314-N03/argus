import { InfoTooltip } from "@/components/ui/info-tooltip/info-tooltip";
import { tooltipContent } from "@/lib/tooltip-content";

import styles from "./tension-index.module.scss";

interface TensionIndexProps {
  value: number; // 0-100
  history?: { timestamp: string; value: number }[];
}

function getColorClass(value: number, s: typeof styles) {
  if (value >= 80) return s.red;
  if (value >= 60) return s.orange;
  if (value >= 30) return s.yellow;

  return s.green;
}

function getStrokeColor(value: number): string {
  if (value >= 80) return "#f4212e";
  if (value >= 60) return "#e67e22";
  if (value >= 30) return "#f4900c";

  return "#18b76f";
}

function buildSvgPaths(
  history: { value: number }[],
  width: number,
  height: number,
) {
  const maxVal = Math.max(...history.map((p) => p.value), 1);
  const padding = 2;

  const points = history.map((p, i) => {
    const x = (i / (history.length - 1)) * width;
    const y = padding + (1 - p.value / maxVal) * (height - padding * 2);

    return `${x},${y}`;
  });

  const polyline = points.join(" ");
  const polygon = `0,${height} ${polyline} ${width},${height}`;

  return { polyline, polygon };
}

export const TensionIndex = ({ value, history }: TensionIndexProps) => {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  const colorClass = getColorClass(clamped, styles);
  const strokeColor = getStrokeColor(clamped);

  const showChart = history && history.length > 1;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.label}>
          Global Tension Index
          <InfoTooltip content={tooltipContent.tension_index} />
        </span>
        <span className={`${styles.value} ${colorClass}`}>{clamped}</span>
      </div>
      {showChart ? (
        <div className={styles.chart}>
          <svg
            viewBox="0 0 300 60"
            preserveAspectRatio="none"
            className={styles.chartSvg}
          >
            <defs>
              <linearGradient id="tensionFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
                <stop
                  offset="100%"
                  stopColor={strokeColor}
                  stopOpacity="0.02"
                />
              </linearGradient>
            </defs>
            <polygon
              points={buildSvgPaths(history, 300, 60).polygon}
              fill="url(#tensionFill)"
            />
            <polyline
              points={buildSvgPaths(history, 300, 60).polyline}
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
        </div>
      ) : (
        <div className={styles.track}>
          <div
            className={`${styles.fill} ${colorClass}`}
            style={{ width: `${clamped}%` }}
          />
        </div>
      )}
    </div>
  );
};
