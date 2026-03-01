// Get indicators API function
import type { TimeWindow } from '@/domain/models'
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

  const indicators = generateMockIndicators(42, params)
  const summary = calculateIndicatorsSummary(indicators)

  return {
    indicators,
    summary,
  }
}
