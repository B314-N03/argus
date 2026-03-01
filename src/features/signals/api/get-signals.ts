import type { SignalType } from '@/domain/models'
import { generateMockSignalsList } from '@/lib/api/mock/signals'
import type { GetSignalsResponse } from '@/lib/api/types'

export interface GetSignalsParams {
  signalType?: SignalType
  limit?: number
}

export async function getSignals(params?: GetSignalsParams): Promise<GetSignalsResponse> {
  await new Promise((resolve) => setTimeout(resolve, 400))

  const count = params?.limit ?? 50
  let signals = generateMockSignalsList(count)

  if (params?.signalType) {
    signals = signals.filter((s) => s.signalType === params.signalType)
  }

  return {
    signals,
    total: signals.length,
  }
}
