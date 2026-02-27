// Get indicators API function
import type { ActivityIndicator, TimeWindow } from '@/domain/models'
import { generateMockIndicators, calculateIndicatorsSummary } from '@/lib/api/mock/indicators'
import type { GetIndicatorsResponse } from '@/lib/api/types'

export interface GetIndicatorsParams {
  region?: string
  type?: string
  timeWindow?: TimeWindow
}

export async function getIndicators(params?: GetIndicatorsParams): Promise<GetIndicatorsResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  let indicators = generateMockIndicators(12)

  // Filter by region if provided
  if (params?.region) {
    indicators = indicators.filter((ind) => ind.region === params.region)
  }

  // Filter by type if provided
  if (params?.type) {
    indicators = indicators.filter((ind) => ind.type === params.type)
  }

  // Filter by time window if provided
  if (params?.timeWindow) {
    indicators = indicators.filter((ind) => ind.timeWindow === params.timeWindow)
  }

  const summary = calculateIndicatorsSummary(indicators)

  return {
    indicators,
    summary,
  }
}
