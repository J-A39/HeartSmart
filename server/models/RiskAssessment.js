const mongoose = require("mongoose");

const MedicationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    dose: { type: String, default: "" },
    frequency: { type: String, default: "" },
    notes: { type: String, default: "" },
  },
  { _id: false }
);

const ExerciseSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    durationMinutes: { type: Number, default: null },
    sessionsPerWeek: { type: Number, default: null },
    notes: { type: String, default: "" },
  },
  { _id: false }
);

const RiskAssessmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    rawRequest: { type: Object, required: true },
    rawMlRequest: { type: Object, required: true },
    rawMlResponse: { type: Object, required: true },

    medications: { type: [MedicationSchema], default: [] },
    medicationText: { type: String, default: "" },
    exercises: { type: [ExerciseSchema], default: [] },

    modelVersion: { type: String, required: true },
    rulesVersion: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RiskAssessment", RiskAssessmentSchema);