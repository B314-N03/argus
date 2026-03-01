import { useQuery } from '@tanstack/react-query'
import { getAircraft, type GetAircraftParams } from '../api/get-aircraft'

export function useAircraft(params?: GetAircraftParams) {
  return useQuery({
    queryKey: ['aircraft', params],
    queryFn: () => getAircraft(params),
    staleTime: 30000,
    refetchInterval: 60000,
  })
}
