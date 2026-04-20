const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const QuizAttempt = require("../models/QuizAttempt");

router.get("/quiz", requireAuth, async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || "50", 10), 100);

    const rows = await QuizAttempt.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch quiz history", detail: err.message });
  }
});

router.post("/quiz", requireAuth, async (req, res) => {
  try {
    const topic = String(req.body.topic || "").trim();
    const score = Number(req.body.score);
    const totalQuestions = Number(req.body.totalQuestions);

    if (!topic || !Number.isFinite(score) || !Number.isFinite(totalQuestions)) {
      return res.status(400).json({ error: "topic, score and totalQuestions are required" });
    }

    const doc = await QuizAttempt.create({
      userId: req.user.id,
      topic,
      score,
      totalQuestions,
    });

    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: "Failed to save quiz attempt", detail: err.message });
  }
});

module.exports = router;
