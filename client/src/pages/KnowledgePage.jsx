import React, { useEffect, useState } from "react";
import knowledgeData from "../data/knowledgeData";

const card = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  padding: 20,
  borderRadius: 10,
};

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

  // topic list view
  if (!selectedTopic) {
    return (
      <section style={card}>
        <h3 style={{ marginBottom: 4 }}>Knowledge & Quizzes</h3>
        <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 16 }}>
          Select a topic to learn about Coronary Artery Disease, then test your knowledge with a quiz.
        </p>

        <div style={{ display: "grid", gap: 8 }}>
          {knowledgeData.map((topic) => {
            const attempts = history.filter((h) => h.topic === topic.title);
            const best = attempts.length > 0
              ? Math.max(...attempts.map((a) => a.score))
              : null;

            return (
              <div
                key={topic.id}
                onClick={() => openTopic(topic)}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  padding: 12,
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "#f9fafb",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{topic.title}</div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                    {topic.quiz.length} question{topic.quiz.length !== 1 ? "s" : ""}
                  </div>
                </div>
                {best !== null && (
                  <div style={{ fontSize: 13, color: "#16a34a", fontWeight: 500 }}>
                    Best: {best}/{topic.quiz.length}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {history.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <h4 style={{ marginBottom: 8 }}>Recent Attempts</h4>
            <div style={{ display: "grid", gap: 4 }}>
              {history.slice(0, 10).map((h) => (
                <div
                  key={h._id}
                  style={{
                    fontSize: 13,
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "4px 0",
                    borderBottom: "1px solid #f3f4f6",
                  }}
                >
                  <span>{h.topic}</span>
                  <span style={{ color: "#6b7280" }}>
                    {h.score}/{h.totalQuestions} — {new Date(h.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    );
  }

  // quiz mode
  if (quizMode) {
    const quiz = selectedTopic.quiz;

    if (finished) {
      const pct = Math.round((score / quiz.length) * 100);
      const color = pct >= 70 ? "#16a34a" : pct >= 40 ? "#d97706" : "#ef4444";

      return (
        <section style={card}>
          <button className="secondary" onClick={backToTopics} style={{ fontSize: 13, marginBottom: 16 }}>
            Back to topics
          </button>
          <h3>Quiz Complete — {selectedTopic.title}</h3>
          <div style={{ marginTop: 16, textAlign: "center" }}>
            <div style={{ fontSize: 36, fontWeight: 700, color }}>{score}/{quiz.length}</div>
            <div style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>{pct}% correct</div>
          </div>
          {saving && <div style={{ marginTop: 8, fontSize: 13, color: "#6b7280" }}>Saving...</div>}
          {saveMsg && (
            <div style={{
              marginTop: 8,
              fontSize: 13,
              color: saveMsg === "Score saved" ? "#16a34a" : "#ef4444",
              textAlign: "center",
            }}>
              {saveMsg}
            </div>
          )}
          <div style={{ marginTop: 16, display: "flex", gap: 8, justifyContent: "center" }}>
            <button onClick={startQuiz}>Retake Quiz</button>
            <button className="secondary" onClick={() => { setQuizMode(false); resetQuiz(); }}>
              Back to Topic
            </button>
          </div>
        </section>
      );
    }

    const q = quiz[currentQ];
    return (
      <section style={card}>
        <button className="secondary" onClick={backToTopics} style={{ fontSize: 13, marginBottom: 16 }}>
          Back to topics
        </button>
        <h3>Quiz — {selectedTopic.title}</h3>
        <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
          Question {currentQ + 1} of {quiz.length}
        </div>

        <div style={{ marginTop: 16, fontWeight: 600, fontSize: 15 }}>{q.question}</div>

        <div style={{ display: "grid", gap: 8, marginTop: 14 }}>
          {q.options.map((opt, idx) => {
            let bg = "#f9fafb";
            let border = "#e5e7eb";
            if (selected !== null) {
              if (idx === q.answer) { bg = "#dcfce7"; border = "#16a34a"; }
              else if (idx === selected && idx !== q.answer) { bg = "#fee2e2"; border = "#ef4444"; }
            }

            return (
              <div
                key={idx}
                onClick={() => pickAnswer(idx)}
                style={{
                  border: `1px solid ${border}`,
                  borderRadius: 6,
                  padding: "10px 14px",
                  cursor: selected !== null ? "default" : "pointer",
                  backgroundColor: bg,
                  fontSize: 14,
                  transition: "border-color 0.2s",
                }}
              >
                {opt}
              </div>
            );
          })}
        </div>

        {selected !== null && (
          <div style={{ marginTop: 14 }}>
            <div style={{
              fontSize: 14,
              marginBottom: 10,
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
      </section>
    );
  }

  // topic content view
  return (
    <section style={card}>
      <button className="secondary" onClick={backToTopics} style={{ fontSize: 13, marginBottom: 16 }}>
        Back to topics
      </button>
      <h3>{selectedTopic.title}</h3>

      <div style={{ marginTop: 12 }}>
        {selectedTopic.content.map((para, i) => (
          <p key={i} style={{ lineHeight: 1.7, fontSize: 14, color: "#374151", marginBottom: 12 }}>
            {para}
          </p>
        ))}
      </div>

      {selectedTopic.quiz.length > 0 && (
        <button onClick={startQuiz} style={{ marginTop: 8 }}>
          Take Quiz ({selectedTopic.quiz.length} question{selectedTopic.quiz.length !== 1 ? "s" : ""})
        </button>
      )}
    </section>
  );
}
