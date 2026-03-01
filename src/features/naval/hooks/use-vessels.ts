import { useQuery } from '@tanstack/react-query'
import { getVessels, type GetVesselsParams } from '../api/get-vessels'

export function useVessels(params?: GetVesselsParams) {
  return useQuery({
    queryKey: ['vessels', params],
    queryFn: () => getVessels(params),
    staleTime: 30000,
    refetchInterval: 60000,
  })
}
