import type { NewsItem } from "@/domain/models";
import { fetchNewsFromApi } from "@/lib/api/news-service";

export interface GetNewsParams {
  query?: string;
  limit?: number;
  timespan?: string;
}

export interface GetNewsResponse {
  items: NewsItem[];
  total: number;
}

export async function getNews(
  params?: GetNewsParams,
): Promise<GetNewsResponse> {
  // Check for mock mode - default to true for development
  const useMock = import.meta.env.VITE_USE_MOCK_DATA !== "false";

  // Try real API first if mock mode is disabled
  if (!useMock) {
    const result = await fetchNewsFromApi(
      params?.query ?? "military defense",
      params?.limit ?? 25,
      params?.timespan ?? "24h",
    );

    // If API returned data, use it
    if (result.items.length > 0) {
      return result;
    }

    // Otherwise fall back to mock
  }

  // Use mock data
  const { mockNewsItems } = await import("@/lib/api/mock/news");

  const count = params?.limit ?? 15;

  return {
    items: mockNewsItems.slice(0, count),
    total: mockNewsItems.length,
  };
}
