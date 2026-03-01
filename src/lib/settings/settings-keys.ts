export const SETTINGS_KEYS = {
  VISIBLE_WIDGETS: 'argus.widgets.visible',
} as const

export interface WidgetVisibility {
  radios: boolean
  indicators: boolean
  aircraft: boolean
  vessels: boolean
  signals: boolean
  chokepoints: boolean
  forceSummary: boolean
}

export const DEFAULT_WIDGET_VISIBILITY: WidgetVisibility = {
  radios: true,
  indicators: true,
  aircraft: true,
  vessels: true,
  signals: true,
  chokepoints: true,
  forceSummary: true,
}
