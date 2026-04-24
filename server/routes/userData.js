const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const User = require("../models/User");
const Logbook = require("../models/Logbook");
const RiskAssessment = require("../models/RiskAssessment");
const QuizAttempt = require("../models/QuizAttempt");

router.get("/user/export", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash").lean();
    const logbook = await Logbook.findOne({ userId: req.user.id }).lean();
    const riskAssessments = await RiskAssessment.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .lean();
    const quizAttempts = await QuizAttempt.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      exportedAt: new Date().toISOString(),
      user: user || null,
      logbook: logbook || { medications: [], exercises: [] },
      riskAssessments,
      quizAttempts,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to export data", detail: err.message });
  }
});

router.delete("/user/data", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    await Logbook.deleteMany({ userId });
    await RiskAssessment.deleteMany({ userId });
    await QuizAttempt.deleteMany({ userId });
    await User.findByIdAndDelete(userId);

    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete data", detail: err.message });
  }
});

module.exports = router;
