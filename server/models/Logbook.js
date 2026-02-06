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

const LogbookSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, required: true },
    medications: { type: [MedicationSchema], default: [] },
    exercises: { type: [ExerciseSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Logbook", LogbookSchema);