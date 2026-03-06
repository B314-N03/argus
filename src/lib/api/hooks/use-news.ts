import { useQuery } from "@tanstack/react-query";

import { getNews, type GetNewsParams } from "@/lib/api/get-news";

export function useNews(params?: GetNewsParams) {
  return useQuery({
    queryKey: ["news", params],
    queryFn: () => getNews(params),
    staleTime: 5 * 60 * 1000, // 5 minutes - news doesn't change rapidly
    refetchInterval: 15 * 60 * 1000, // Refetch every 15 minutes
  });
}
