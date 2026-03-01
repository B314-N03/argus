import type { AircraftCategory } from '@/domain/models'
import { generateMockAircraftList } from '@/lib/api/mock/aircraft'
import type { GetAircraftResponse } from '@/lib/api/types'

export interface GetAircraftParams {
  category?: AircraftCategory
  limit?: number
}

export async function getAircraft(params?: GetAircraftParams): Promise<GetAircraftResponse> {
  await new Promise((resolve) => setTimeout(resolve, 400))

  const count = params?.limit ?? 50
  let aircraft = generateMockAircraftList(count)

  if (params?.category) {
    aircraft = aircraft.filter((a) => a.category === params.category)
  }

  return {
    aircraft,
    total: aircraft.length,
  }
}
