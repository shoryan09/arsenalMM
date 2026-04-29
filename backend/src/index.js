import "dotenv/config";
import express from "express";
import cors from "cors";
import standingsRouter from "./routes/standings.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/standings", standingsRouter);

app.get("/", (req, res) => {
  res.send("Arsenal Hub API is running");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});