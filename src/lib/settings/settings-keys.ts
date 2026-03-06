import type { AircraftCategory } from "@/domain/models";

export const SETTINGS_KEYS = {
  VISIBLE_WIDGETS: "argus.widgets.visible",
  GLOBE_ENTITY_FILTERS: "argus.globe.entityFilters",
  AIRCRAFT_CATEGORY_FILTERS: "argus.globe.aircraftCategoryFilters",
  GLOBE_SETTINGS: "argus.globe.settings",
  SIDEBAR_STATE: "argus.ui.sidebarState",
  FEED_SPLIT: "argus.ui.feedSplit",
} as const;

export interface WidgetVisibility {
  radios: boolean;
  indicators: boolean;
  aircraft: boolean;
  vessels: boolean;
  signals: boolean;
  chokepoints: boolean;
  forceSummary: boolean;
}

export const DEFAULT_WIDGET_VISIBILITY: WidgetVisibility = {
  radios: true,
  indicators: true,
  aircraft: true,
  vessels: true,
  signals: true,
  chokepoints: true,
  forceSummary: true,
};

export interface GlobeEntityFilters {
  aircraft: boolean;
  vessel: boolean;
  signal: boolean;
}

export interface AircraftCategoryFilters {
  military: boolean;
  government: boolean;
  commercial: boolean;
  cargo: boolean;
  private: boolean;
}

export const DEFAULT_AIRCRAFT_CATEGORY_FILTERS: AircraftCategoryFilters = {
  military: true,
  government: true,
  commercial: false,
  cargo: false,
  private: false,
};

export const DEFAULT_GLOBE_ENTITY_FILTERS: GlobeEntityFilters = {
  aircraft: true,
  vessel: true,
  signal: true,
};

export function isAircraftCategoryIncluded(
  category: AircraftCategory,
  filters: AircraftCategoryFilters,
): boolean {
  switch (category) {
    case "military":
      return filters.military;
    case "government":
      return filters.government;
    case "commercial":
      return filters.commercial;
    case "cargo":
      return filters.cargo;
    case "private":
      return filters.private;
    case "unknown":
      return true;
  }
}

export interface SidebarState {
  leftWidth: number;
  rightWidth: number;
  leftCollapsed: boolean;
  rightCollapsed: boolean;
}

export const DEFAULT_SIDEBAR_STATE: SidebarState = {
  leftWidth: 280,
  rightWidth: 280,
  leftCollapsed: false,
  rightCollapsed: false,
};

export interface GlobeSettings {
  texture: "night" | "day" | "blue-marble" | "topology";
  background: "night-sky" | "dark";
  showAtmosphere: boolean;
  atmosphereColor: "blue" | "cyan" | "green" | "orange";
  atmosphereAltitude: "low" | "medium" | "high";
  showGraticules: boolean;
  animateIn: boolean;
}

export const DEFAULT_GLOBE_SETTINGS: GlobeSettings = {
  texture: "night",
  background: "night-sky",
  showAtmosphere: true,
  atmosphereColor: "blue",
  atmosphereAltitude: "medium",
  showGraticules: false,
  animateIn: false,
};

export interface FeedSplitState {
  topRatio: number;
  topCollapsed: boolean;
  bottomCollapsed: boolean;
}

export const DEFAULT_FEED_SPLIT_STATE: FeedSplitState = {
  topRatio: 0.5,
  topCollapsed: false,
  bottomCollapsed: false,
};
