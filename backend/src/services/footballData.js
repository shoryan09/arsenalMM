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
export async function getSquad() {
  const cacheKey = "squad";

  const cached = cache.get(cacheKey);
  if (cached) {
    console.log(`[CACHE HIT] ${cacheKey}`);
    return cached;
  }

  console.log(`[CACHE MISS] ${cacheKey} — fetching`);
  const { data } = await axios.get(
    `${API_BASE}/teams/57`,
    { headers }
  );

  // Cache for 24 hours — squad rarely changes
  cache.set(cacheKey, data, 86400);
  return data;
}

export async function getFixtures() {
  const cacheKey = "fixtures";

  const cached = cache.get(cacheKey);
  if (cached) {
    console.log(`[CACHE HIT] ${cacheKey}`);
    return cached;
  }

  console.log(`[CACHE MISS] ${cacheKey} — fetching`);
  // Get scheduled (upcoming) matches, limit 30
  const { data } = await axios.get(
    `${API_BASE}/teams/57/matches?status=SCHEDULED&limit=30`,
    { headers }
  );

  // Cache for 1 hour — fixtures rarely change
  cache.set(cacheKey, data, 3600);
  return data;
}

export async function getNextMatch() {
  const cacheKey = "next_match";

  const cached = cache.get(cacheKey);
  if (cached) {
    console.log(`[CACHE HIT] ${cacheKey}`);
    return cached;
  }

  console.log(`[CACHE MISS] ${cacheKey} — fetching`);
  const { data } = await axios.get(
    `${API_BASE}/teams/57/matches?status=SCHEDULED&limit=1`,
    { headers }
  );

  const nextMatch = data.matches[0] || null;
  cache.set(cacheKey, nextMatch, 1800); // cache 30 min
  return nextMatch;
}
export async function getResults() {
  const cacheKey = "results";

  const cached = cache.get(cacheKey);
  if (cached) {
    console.log(`[CACHE HIT] ${cacheKey}`);
    return cached;
  }

  console.log(`[CACHE MISS] ${cacheKey} — fetching`);
  const { data } = await axios.get(
    `${API_BASE}/teams/57/matches?status=FINISHED&limit=30`,
    { headers }
  );

  cache.set(cacheKey, data, 3600);
  return data;
}