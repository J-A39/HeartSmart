const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const RiskAssessment = require("../models/RiskAssessment");

router.get("/history", requireAuth, async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || "20", 10), 100);

    const rows = await RiskAssessment.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select({
        createdAt: 1,
        modelVersion: 1,
        rulesVersion: 1,
        medications: 1,
        medicationText: 1,
        exercises: 1,
        rawMlResponse: 1,
      })
      .lean();

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch history", detail: err.message });
  }
});

module.exports = router;