import {
  generateMockRadioStations,
  calculateRadioSummary,
} from "@/lib/api/mock/radios";
import type { GetRadiosResponse } from "@/lib/api/types";

export async function getRadios(): Promise<GetRadiosResponse> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const stations = generateMockRadioStations();
  const summary = calculateRadioSummary(stations);

  return { stations, summary };
}
