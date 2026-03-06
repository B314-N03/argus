import type { AircraftCategory } from "@/domain/models";
import { fetchAircraftFromApi } from "@/lib/api/aircraft-service";
import { generateMockAircraftList } from "@/lib/api/mock/aircraft";
import type { GetAircraftResponse } from "@/lib/api/types";

export interface GetAircraftParams {
  category?: AircraftCategory;
  limit?: number;
}

export async function getAircraft(
  params?: GetAircraftParams,
): Promise<GetAircraftResponse> {
  const useMock = import.meta.env.VITE_USE_MOCK_DATA !== "false";

  // Try real API first if mock mode is disabled
  if (!useMock) {
    const result = await fetchAircraftFromApi(
      params?.category,
      params?.limit ?? 50,
    );

    if (result.aircraft.length > 0) {
      return result;
    }
  }

  // Use mock data
  await new Promise((resolve) => setTimeout(resolve, 400));

  const count = params?.limit ?? 50;
  let aircraft = generateMockAircraftList(count);

  if (params?.category) {
    aircraft = aircraft.filter((a) => a.category === params.category);
  }

  return {
    aircraft,
    total: aircraft.length,
  };
}
