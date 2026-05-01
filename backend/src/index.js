import "dotenv/config";
import express from "express";
import cors from "cors";
import standingsRouter from "./routes/standings.js";
import squadRouter from "./routes/squad.js";
import matchesRouter from "./routes/matches.js";
import newsRouter from "./routes/news.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/standings", standingsRouter);
app.use("/api/squad", squadRouter);
app.use("/api/matches", matchesRouter);
app.use("/api/news", newsRouter);

app.get("/", (req, res) => {
  res.send("Arsenal Hub API is running");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});