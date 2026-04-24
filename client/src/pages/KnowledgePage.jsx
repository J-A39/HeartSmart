import React, { useEffect, useState } from "react";
import knowledgeData from "../data/knowledgeData";

export default function KnowledgePage({ api, onUnauthorized }) {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [quizMode, setQuizMode] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  async function loadHistory() {
    setLoadingHistory(true);
    try {
      const resp = await api.get("/api/quiz?limit=50");
      setHistory(resp.data);
    } catch (e) {
      if (e?.response?.status === 401) onUnauthorized();
    } finally {
      setLoadingHistory(false);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  function openTopic(topic) {
    setSelectedTopic(topic);
    setQuizMode(false);
    resetQuiz();
  }

  function backToTopics() {
    setSelectedTopic(null);
    setQuizMode(false);
    resetQuiz();
  }

  function startQuiz() {
    resetQuiz();
    setQuizMode(true);
  }

  function resetQuiz() {
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setSaveMsg("");
  }

  function pickAnswer(idx) {
    if (selected !== null) return;
    setSelected(idx);

    const correct = selectedTopic.quiz[currentQ].answer;
    if (idx === correct) {
      setScore((s) => s + 1);
    }
  }

  function nextQuestion() {
    const next = currentQ + 1;
    if (next >= selectedTopic.quiz.length) {
      setFinished(true);
      saveAttempt(score);
    } else {
      setCurrentQ(next);
      setSelected(null);
    }
  }

  async function saveAttempt(finalScore) {
    setSaving(true);
    try {
      await api.post("/api/quiz", {
        topic: selectedTopic.title,
        score: finalScore,
        totalQuestions: selectedTopic.quiz.length,
      });
      setSaveMsg("Score saved");
      loadHistory();
    } catch (e) {
      const m = e?.response?.data?.error || e?.response?.data?.detail || e.message || "Failed to save";
      setSaveMsg(m);
      if (e?.response?.status === 401) onUnauthorized();
    } finally {
      setSaving(false);
    }
  }

  if (!selectedTopic) {
    return (
      <div>
        <h3 style={{ marginBottom: 4 }}>Knowledge & Quizzes</h3>
        <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 20 }}>
          Learn about Coronary Artery Disease, then test yourself with quizzes.
        </p>

        <div style={{ display: "grid", gap: 8 }}>
          {knowledgeData.map((topic) => {
            const attempts = history.filter((h) => h.topic === topic.title);
            const best = attempts.length > 0 ? Math.max(...attempts.map((a) => a.score)) : null;
            const pct = best !== null ? Math.round((best / topic.quiz.length) * 100) : null;

            return (
              <div key={topic.id} className="topic-card" onClick={() => openTopic(topic)}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 2 }}>{topic.title}</div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>
                    {topic.content.length} section{topic.content.length !== 1 ? "s" : ""}
                    {" · "}
                    {topic.quiz.length} question{topic.quiz.length !== 1 ? "s" : ""}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {pct !== null && (
                    <span className={`badge ${pct >= 70 ? "badge-green" : pct >= 40 ? "badge-amber" : "badge-red"}`}>
                      Best: {best}/{topic.quiz.length}
                    </span>
                  )}
                  <span style={{ color: "#9ca3af", fontSize: 18 }}>›</span>
                </div>
              </div>
            );
          })}
        </div>

        {history.length > 0 && (
          <div className="card" style={{ marginTop: 20 }}>
            <h4 style={{ marginBottom: 12 }}>Recent Attempts</h4>
            {history.slice(0, 10).map((h) => (
              <div
                key={h._id}
                style={{
                  fontSize: 13,
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "6px 0",
                  borderBottom: "1px solid #f3f4f6",
                }}
              >
                <span style={{ color: "#374151" }}>{h.topic}</span>
                <span style={{ color: "#6b7280" }}>
                  {h.score}/{h.totalQuestions} — {new Date(h.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (quizMode && finished) {
    const quiz = selectedTopic.quiz;
    const pct = Math.round((score / quiz.length) * 100);
    const color = pct >= 70 ? "#16a34a" : pct >= 40 ? "#d97706" : "#ef4444";

    return (
      <div>
        <button className="ghost" onClick={backToTopics} style={{ marginBottom: 16 }}>
          ← Back to topics
        </button>
        <div className="card" style={{ textAlign: "center", padding: 40 }}>
          <h3 style={{ marginBottom: 20 }}>Quiz Complete</h3>
          <div style={{ fontSize: 48, fontWeight: 700, color }}>{pct}%</div>
          <div style={{ fontSize: 16, color: "#6b7280", marginTop: 4 }}>
            {score} out of {quiz.length} correct
          </div>
          {saving && <div style={{ marginTop: 12, fontSize: 13, color: "#6b7280" }}>Saving...</div>}
          {saveMsg && (
            <div style={{ marginTop: 12, fontSize: 13, color: saveMsg === "Score saved" ? "#16a34a" : "#ef4444" }}>
              {saveMsg}
            </div>
          )}
          <div style={{ marginTop: 24, display: "flex", gap: 8, justifyContent: "center" }}>
            <button onClick={startQuiz}>Retake Quiz</button>
            <button className="secondary" onClick={() => { setQuizMode(false); resetQuiz(); }}>
              Back to Topic
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (quizMode) {
    const quiz = selectedTopic.quiz;
    const q = quiz[currentQ];
    const progress = ((currentQ + 1) / quiz.length) * 100;

    return (
      <div>
        <button className="ghost" onClick={backToTopics} style={{ marginBottom: 16 }}>
          ← Back to topics
        </button>
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h4>{selectedTopic.title}</h4>
            <span style={{ fontSize: 13, color: "#6b7280" }}>
              {currentQ + 1} / {quiz.length}
            </span>
          </div>

          <div style={{
            height: 4,
            background: "#e5e7eb",
            borderRadius: 2,
            marginBottom: 20,
            overflow: "hidden",
          }}>
            <div style={{
              height: "100%",
              width: `${progress}%`,
              background: "#2563eb",
              borderRadius: 2,
              transition: "width 0.3s",
            }} />
          </div>

          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 16 }}>{q.question}</div>

          <div style={{ display: "grid", gap: 8 }}>
            {q.options.map((opt, idx) => {
              let cls = "quiz-option";
              if (selected !== null) {
                cls += " locked";
                if (idx === q.answer) cls += " correct";
                else if (idx === selected && idx !== q.answer) cls += " incorrect";
              }

              return (
                <div key={idx} className={cls} onClick={() => pickAnswer(idx)}>
                  {opt}
                </div>
              );
            })}
          </div>

          {selected !== null && (
            <div style={{ marginTop: 16 }}>
              <div style={{
                fontSize: 14,
                marginBottom: 12,
                color: selected === q.answer ? "#16a34a" : "#ef4444",
                fontWeight: 500,
              }}>
                {selected === q.answer
                  ? "Correct!"
                  : `Incorrect — the answer is: ${q.options[q.answer]}`}
              </div>
              <button onClick={nextQuestion}>
                {currentQ + 1 < quiz.length ? "Next Question" : "See Results"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <button className="ghost" onClick={backToTopics} style={{ marginBottom: 16 }}>
        ← Back to topics
      </button>
      <div className="card">
        <h3 style={{ marginBottom: 16 }}>{selectedTopic.title}</h3>
        {selectedTopic.content.map((para, i) => (
          <p key={i} style={{ lineHeight: 1.75, fontSize: 14, color: "#374151", marginBottom: 14 }}>
            {para}
          </p>
        ))}

        {selectedTopic.quiz.length > 0 && (
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #e5e7eb" }}>
            <button onClick={startQuiz}>
              Take Quiz ({selectedTopic.quiz.length} question{selectedTopic.quiz.length !== 1 ? "s" : ""})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
