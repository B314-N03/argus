import { useQuery } from '@tanstack/react-query'
import { getSignals, type GetSignalsParams } from '../api/get-signals'

export function useSignals(params?: GetSignalsParams) {
  return useQuery({
    queryKey: ['signals', params],
    queryFn: () => getSignals(params),
    staleTime: 30000,
    refetchInterval: 60000,
  })
}
