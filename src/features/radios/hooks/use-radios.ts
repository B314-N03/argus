import { useQuery } from '@tanstack/react-query'
import { getRadios } from '../api/get-radios'

export function useRadios() {
  return useQuery({
    queryKey: ['radios'],
    queryFn: getRadios,
    staleTime: 30000,
    refetchInterval: 60000,
  })
}
