// useIndicators hook
import { useQuery } from "@tanstack/react-query";

import type { TimeWindow } from "@/domain/models";

import { getIndicators, type GetIndicatorsParams } from "../api/get-indicators";

export function useIndicators(
  params?: GetIndicatorsParams & { timeWindow?: TimeWindow },
) {
  return useQuery({
    queryKey: ["indicators", params],
    queryFn: () => getIndicators(params),
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
}
