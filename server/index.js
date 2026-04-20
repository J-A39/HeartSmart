const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectMongo } = require("./db");

const authRoutes = require("./routes/auth");
const riskRoutes = require("./routes/risk");
const historyRoutes = require("./routes/history");
const logbookRoutes = require("./routes/logbook");
const quizRoutes = require("./routes/quiz");
const userDataRoutes = require("./routes/userData");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api", riskRoutes);
app.use("/api", historyRoutes);
app.use("/api", logbookRoutes);
app.use("/api", quizRoutes);
app.use("/api", userDataRoutes);

connectMongo()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Express running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });