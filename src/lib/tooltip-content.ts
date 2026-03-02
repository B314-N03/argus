// Centralized tooltip strings for all data cards and indicators

export const tooltipContent: Record<string, string> = {
  // Indicator types
  isr_activity:
    "ISR Activity Index measures Intelligence, Surveillance, and Reconnaissance flight patterns relative to regional baselines.",
  naval_presence:
    "Naval Presence Index tracks the density of naval vessel activity in a region compared to historical averages.",
  tanker_density:
    "Tanker Density Score quantifies aerial refueling tanker operations, which often correlate with increased military air activity.",
  signal_activity:
    "Signal Activity Index aggregates detected radio and radar emissions, highlighting changes in electromagnetic spectrum usage.",
  air_activity:
    "Air Activity Index measures overall airborne traffic volume including military, government, and commercial flights.",
  anomaly_score:
    "Anomaly Score identifies statistical deviations from expected patterns across multiple data sources.",

  // Dashboard stat cards
  air_stat:
    "Total number of aircraft tracked across all monitored regions in the selected time window.",
  naval_stat:
    "Total number of vessels detected via AIS and other maritime tracking sources globally.",
  signals_stat:
    "Total signal events captured across all frequency bands and sensor types today.",
  indicators_stat:
    "Number of active analytical indicators currently being computed across all regions.",
  elevated_stat:
    "Indicators showing deviation greater than +15% from their regional baseline.",
  anomalous_stat:
    "Indicators with deviation exceeding +30%, suggesting significant departure from normal activity patterns.",

  // Radio feature
  radio_status:
    "Monitors known military and numbers station broadcasts. Activity levels reflect recent transmission frequency and signal characteristics.",
  radio_activity:
    "Overall activity level across all monitored radio stations, based on transmission frequency and duration.",

  // Tension index
  tension_index:
    "Global Tension Index is a composite score derived from indicator deviations, elevated region counts, and anomalous activity across all domains.",
};
