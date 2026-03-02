import type { ShipType } from "@/domain/models";
import { generateMockVesselsList } from "@/lib/api/mock/vessels";
import type { GetVesselsResponse } from "@/lib/api/types";

export interface GetVesselsParams {
  shipType?: ShipType;
  limit?: number;
}

export async function getVessels(
  params?: GetVesselsParams,
): Promise<GetVesselsResponse> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const count = params?.limit ?? 30;
  let vessels = generateMockVesselsList(count);

  if (params?.shipType) {
    vessels = vessels.filter((v) => v.shipType === params.shipType);
  }

  return {
    vessels,
    total: vessels.length,
  };
}
