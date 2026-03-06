import type { NewsItem } from "@/domain/models";
import type { GdeltArticle } from "@/lib/api/types";

const GDELT_BASE = "https://api.gdeltproject.org/api/v2/doc/doc";

/**
 * Map GDELT article to NewsItem domain model
 */
export function mapGdeltToNewsItem(
  article: GdeltArticle,
  index: number,
): NewsItem {
  // Use URL hash + index to ensure unique IDs
  const urlHash = btoa(article.url).replace(/[/+=]/g, "");

  return {
    id: `news_gdelt_${urlHash}_${index}`,
    source: article.domain,
    sourceType: "news",
    content: article.title,
    url: article.url,
    timestamp: parseGdeltDate(article.seendate),
    tags: deriveTags(article.title, article.themes),
    region: undefined, // Would need NLP to derive region from content
  };
}

/**
 * Parse GDELT date format (e.g., "20250128T120000Z") to ISO string
 */
function parseGdeltDate(gdeltDate: string): string {
  // Format: YYYYMMDDTHHMMSSZ
  const match = gdeltDate.match(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/);

  if (!match) {
    return new Date().toISOString();
  }

  const [, year, month, day, hour, minute, second] = match;

  return `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
}

/**
 * Derive tags from title and themes
 */
function deriveTags(title: string, themes?: string): string[] {
  const tags: string[] = [];

  // Extract keywords from title
  const lowerTitle = title.toLowerCase();

  const keywords = [
    "military",
    "naval",
    "air",
    "army",
    "defense",
    "exercise",
    "deployment",
    "radar",
    "aircraft",
    "vessel",
    "drone",
  ];

  for (const keyword of keywords) {
    if (lowerTitle.includes(keyword)) {
      tags.push(keyword);
    }
  }

  // Add theme tags if available
  if (themes) {
    const themeList = themes.split(";").slice(0, 3);

    tags.push(...themeList);
  }

  return [...new Set(tags)].slice(0, 5);
}

/**
 * Fetch news from GDELT API
 * Returns empty array on failure (caller should fall back to mock)
 */
export async function fetchNewsFromApi(
  query = "military defense",
  limit = 25,
  timespan = "24h",
): Promise<{ items: NewsItem[]; total: number }> {
  try {
    const gdeltUrl = new URL(GDELT_BASE);

    gdeltUrl.searchParams.set("query", query);
    gdeltUrl.searchParams.set("mode", "artlist");
    gdeltUrl.searchParams.set("format", "json");
    gdeltUrl.searchParams.set("maxrecords", String(limit));
    gdeltUrl.searchParams.set("timespan", timespan);

    const response = await fetch(gdeltUrl.toString(), {
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      return { items: [], total: 0 };
    }

    const data = await response.json();
    const articles = data.articles ?? [];

    const newsItems = articles.slice(0, limit).map((article, idx) =>
      mapGdeltToNewsItem(article, idx),
    );

    return {
      items: newsItems,
      total: newsItems.length,
    };
  } catch {
    return { items: [], total: 0 };
  }
}
