const MODEL_FIELDS = ["age", "male", "currentSmoker", "cigsPerDay", "diabetes", "BMI", "sysBP", "totChol", "glucose", "unknown_flags",];

function pickMlPayload(body) {
  const out = {};
  for (const k of MODEL_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(body, k)) out[k] = body[k];
  }
  if (!out.unknown_flags) out.unknown_flags = {};
  return out;
}
module.exports = { pickMlPayload };