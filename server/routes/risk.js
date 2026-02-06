const router = require("express").Router();
const axios = require("axios");
const { requireAuth } = require("../middleware/auth");
const { pickMlPayload } = require("../utils/pickMlPayload");
const RiskAssessment = require("../models/RiskAssessment");
const Logbook = require("../models/Logbook");

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://127.0.0.1:8000/predict";

router.post("/risk", requireAuth, async (req, res) => {
  try {
    const rawRequest = req.body || {};
    const mlPayload = pickMlPayload(rawRequest);

    const mlResp = await axios.post(ML_SERVICE_URL, mlPayload, { timeout: 8000 });
    const outputs = mlResp.data;

    const logbook = await Logbook.findOne({ userId: req.user.id }).lean();
    const medications = logbook?.medications || [];
    const exercises = logbook?.exercises || [];

    await RiskAssessment.create({
      userId: req.user.id,
      rawRequest,
      rawMlRequest: mlPayload,
      rawMlResponse: outputs,
      medications,
      medicationText: "",
      exercises,
      modelVersion: outputs.model_version ?? "unknown",
      rulesVersion: outputs.rules_version ?? "unknown",
    });

    res.json(outputs);
  } catch (err) {
    res.status(500).json({ error: "Failed to predict and/or save", detail: err.message });
  }
});

module.exports = router;