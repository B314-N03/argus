import type { SignalPattern } from "@/domain/models";

import styles from "./signal-waveform.module.scss";

interface SignalWaveformProps {
  pattern: SignalPattern;
  isActive: boolean;
}

const BAR_COUNT = 12;

function getPatternClass(pattern: SignalPattern, s: typeof styles): string {
  const map: Record<SignalPattern, string> = {
    buzz: s.buzz,
    pip: s.pip,
    sweep: s.sweep,
    numbers: s.numbers,
    morse: s.morse,
    silence: s.silence,
  };

  return map[pattern];
}

export const SignalWaveform = ({ pattern, isActive }: SignalWaveformProps) => {
  const patternClass = getPatternClass(pattern, styles);
  const activeClass = isActive ? styles.active : "";

  return (
    <svg
      viewBox="0 0 80 24"
      className={`${styles.waveform} ${patternClass} ${activeClass}`}
      aria-label={`Signal pattern: ${pattern}`}
    >
      {Array.from({ length: BAR_COUNT }, (_, i) => (
        <rect
          key={i}
          className={styles.bar}
          x={2 + i * 6.5}
          y={8}
          width={3}
          height={8}
          rx={1}
          style={{ animationDelay: `${i * 0.05}s` }}
        />
      ))}
    </svg>
  );
};
