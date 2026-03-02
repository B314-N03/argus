import type { AircraftAsset } from "@/domain/models";
import { getAircraftAssets } from "@/lib/api/mock/aircraft-assets";

export async function fetchAircraftAssets(
  search?: string,
): Promise<AircraftAsset[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  return getAircraftAssets(search);
}
