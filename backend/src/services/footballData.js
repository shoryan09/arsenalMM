import axios from "axios";
import { cache } from "../cache.js";

const API_BASE = "https://api.football-data.org/v4";
const headers = { "X-Auth-Token": process.env.FOOTBALL_API_KEY };

export async function getStandings(competition) {
  const cacheKey = `standings_${competition}`;

  const cached = cache.get(cacheKey);
  if (cached) {
    console.log(`[CACHE HIT] ${cacheKey}`);
    return cached;
  }

  console.log(`[CACHE MISS] ${cacheKey} — fetching`);
  const { data } = await axios.get(
    `${API_BASE}/competitions/${competition}/standings`,
    { headers }
  );

  cache.set(cacheKey, data);
  return data;
}

