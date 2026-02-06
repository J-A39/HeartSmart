const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const Logbook = require("../models/Logbook");

router.get("/logbook", requireAuth, async (req, res) => {
  try {
    const doc = await Logbook.findOne({ userId: req.user.id }).lean();
    res.json(doc || { medications: [], exercises: [] });
  } catch (err) {
    res.status(500).json({ error: "Failed to load logbook", detail: err.message });
  }
});

router.put("/logbook", requireAuth, async (req, res) => {
  try {
    const medications = Array.isArray(req.body.medications) ? req.body.medications : [];
    const exercises = Array.isArray(req.body.exercises) ? req.body.exercises : [];

    const doc = await Logbook.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { medications, exercises } },
      { new: true, upsert: true }
    ).lean();

    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: "Failed to save logbook", detail: err.message });
  }
});

module.exports = router;