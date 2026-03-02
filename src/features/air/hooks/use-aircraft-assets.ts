import { useQuery } from "@tanstack/react-query";

import { fetchAircraftAssets } from "../api/get-aircraft-assets";

export function useAircraftAssets(search?: string) {
  return useQuery({
    queryKey: ["aircraft-assets", search],
    queryFn: () => fetchAircraftAssets(search),
    staleTime: Infinity, // static data
  });
}
