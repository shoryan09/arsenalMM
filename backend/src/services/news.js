import Parser from "rss-parser";
import { cache } from "../cache.js";

const parser = new Parser({
  customFields: {
    item: ["media:content", "media:thumbnail", "enclosure"],
  },
});

const FEEDS = [
  { name: "Arseblog", url: "https://arseblog.com/feed/" },
  { name: "BBC Sport", url: "https://feeds.bbci.co.uk/sport/football/teams/arsenal/rss.xml" },
];

export async function getNews() {
  const cacheKey = "news";

  const cached = cache.get(cacheKey);
  if (cached) {
    console.log(`[CACHE HIT] ${cacheKey}`);
    return cached;
  }

  console.log(`[CACHE MISS] ${cacheKey} — fetching`);

  const allArticles = await Promise.all(
    FEEDS.map(async ({ name, url }) => {
      try {
        const feed = await parser.parseURL(url);
        return feed.items.slice(0, 10).map(item => ({
          id: item.guid || item.link,
          title: item.title?.trim(),
          link: item.link,
          pubDate: item.pubDate || item.isoDate,
          source: name,
          excerpt: cleanExcerpt(item.contentSnippet || item.content),
          image: extractImage(item),
        }));
      } catch (err) {
        console.error(`Failed to fetch ${name}:`, err.message);
        return [];
      }
    })
  );

  const flattened = allArticles
    .flat()
    .filter(a => a.title) // skip any malformed entries
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  cache.set(cacheKey, flattened, 900); // 15 min cache
  return flattened;
}

function cleanExcerpt(text) {
  if (!text) return "";
  return text
    .replace(/<[^>]+>/g, "") // strip HTML tags
    .replace(/\s+/g, " ")    // collapse whitespace
    .trim()
    .slice(0, 180) + "...";
}

function extractImage(item) {
  // Try multiple RSS image fields
  if (item["media:thumbnail"]?.$?.url) return item["media:thumbnail"].$.url;
  if (item["media:content"]?.$?.url) return item["media:content"].$.url;
  if (item.enclosure?.url) return item.enclosure.url;

  // Fallback: extract first <img> from HTML content
  const html = item["content:encoded"] || item.content || "";
  const match = html.match(/<img[^>]+src="([^">]+)"/);
  return match ? match[1] : null;
}