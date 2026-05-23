import "dotenv/config";
import { bulkStoreData } from "../services/embeddings.js";
import { getStandings, getSquad, getFixtures, getResults } from "../services/footballData.js";
import { getNews } from "../services/news.js";

function calculateAge(dob) {
  return Math.floor((Date.now() - new Date(dob)) / (1000 * 60 * 60 * 24 * 365.25));
}

async function indexAll() {
  const items = [];

  console.log("Preparing squad data...");
  const team = await getSquad();
  for (const player of team.squad) {
    const age = calculateAge(player.dateOfBirth);
    const text = `${player.name} plays as ${player.position || "squad player"} for Arsenal. He is ${age} years old, from ${player.nationality}, wearing shirt number ${player.shirtNumber || "unknown"}.`;
    items.push({
      id: `player_${player.id}`,
      text,
      metadata: { type: "player", name: player.name },
    });
  }

  if (team.coach) {
    items.push({
      id: `coach_${team.coach.id}`,
      text: `${team.coach.name} is the head coach of Arsenal, from ${team.coach.nationality}, contracted until ${team.coach.contract.until}.`,
      metadata: { type: "coach" },
    });
  }

  console.log("Preparing fixtures data...");
  const fixtures = await getFixtures();
  for (const match of fixtures.matches) {
    const isHome = match.homeTeam.id === 57;
    const opponent = isHome ? match.awayTeam.name : match.homeTeam.name;
    const date = new Date(match.utcDate).toDateString();
    const text = `Arsenal will play ${opponent} on ${date} in the ${match.competition.name}. Arsenal is playing ${isHome ? "at home" : "away"}.`;
    items.push({
      id: `fixture_${match.id}`,
      text,
      metadata: { type: "fixture" },
    });
  }

  console.log("Preparing results data...");
  const results = await getResults();
  for (const match of results.matches) {
    const isHome = match.homeTeam.id === 57;
    const opponent = isHome ? match.awayTeam.name : match.homeTeam.name;
    const arsenalScore = isHome ? match.score.fullTime.home : match.score.fullTime.away;
    const oppScore = isHome ? match.score.fullTime.away : match.score.fullTime.home;
    const outcome = arsenalScore > oppScore ? "won" : arsenalScore < oppScore ? "lost" : "drew";
    const date = new Date(match.utcDate).toDateString();
    const text = `Arsenal ${outcome} ${arsenalScore}-${oppScore} against ${opponent} on ${date} in the ${match.competition.name}.`;
    items.push({
      id: `result_${match.id}`,
      text,
      metadata: { type: "result" },
    });
  }

  console.log("Preparing standings data...");
  try {
    const plStandings = await getStandings("PL");
    const arsenalRow = plStandings.standings[0].table.find(t => t.team.id === 57);
    if (arsenalRow) {
      items.push({
        id: `standings_PL`,
        text: `Arsenal is currently in position ${arsenalRow.position} in the Premier League with ${arsenalRow.points} points, ${arsenalRow.won} wins, ${arsenalRow.draw} draws, ${arsenalRow.lost} losses, ${arsenalRow.goalsFor} goals scored and ${arsenalRow.goalsAgainst} goals conceded.`,
        metadata: { type: "standings" },
      });
    }
  } catch (err) {
    console.log("Standings unavailable, skipping");
  }

  console.log("Preparing news data...");
  const articles = await getNews();
  for (const article of articles.slice(0, 30)) {
    const text = `News from ${article.source}: ${article.title}. ${article.excerpt || ""}`;
    items.push({
      id: `news_${article.id.slice(0, 80)}`,
      text,
      metadata: { type: "news", source: article.source },
    });
  }

  console.log(`Storing ${items.length} items in Pinecone...`);

  for (let i = 0; i < items.length; i += 50) {
    const chunk = items.slice(i, i + 50);
    await bulkStoreData(chunk);
    console.log(`Indexed ${Math.min(i + 50, items.length)}/${items.length}`);
  }

  console.log("Done!");
  process.exit(0);
}

indexAll().catch(err => {
  console.error("Indexing failed:", err);
  process.exit(1);
});