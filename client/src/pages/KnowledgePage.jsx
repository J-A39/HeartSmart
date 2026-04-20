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

  // topic list view
  if (!selectedTopic) {
    return (
      <section style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
        <h3 style={{ margin: 0, marginBottom: 12 }}>Knowledge & Quizzes</h3>
        <p style={{ fontSize: 14, opacity: 0.8, marginTop: 0 }}>
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
                style={{
                  border: "1px solid #eee",
                  borderRadius: 8,
                  padding: 10,
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                onClick={() => openTopic(topic)}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{topic.title}</div>
                  <div style={{ fontSize: 12, opacity: 0.7 }}>
                    {topic.quiz.length} question{topic.quiz.length !== 1 ? "s" : ""}
                  </div>
                </div>
                {best !== null && (
                  <div style={{ fontSize: 12, opacity: 0.8 }}>
                    Best: {best}/{topic.quiz.length}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {history.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <h4 style={{ marginBottom: 8 }}>Recent Attempts</h4>
            <div style={{ display: "grid", gap: 6 }}>
              {history.slice(0, 10).map((h) => (
                <div key={h._id} style={{ fontSize: 13, display: "flex", justifyContent: "space-between" }}>
                  <span>{h.topic}</span>
                  <span>
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
      return (
        <section style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
          <button onClick={backToTopics} style={{ marginBottom: 12 }}>Back to topics</button>
          <h3 style={{ margin: 0 }}>Quiz Complete — {selectedTopic.title}</h3>
          <div style={{ marginTop: 12, fontSize: 18 }}>
            You scored <b>{score}</b> out of <b>{quiz.length}</b>
          </div>
          {saving && <div style={{ marginTop: 8, fontSize: 13 }}>Saving...</div>}
          {saveMsg && <div style={{ marginTop: 8, fontSize: 13, color: saveMsg === "Score saved" ? "green" : "crimson" }}>{saveMsg}</div>}
          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <button onClick={startQuiz}>Retake Quiz</button>
            <button onClick={() => { setQuizMode(false); resetQuiz(); }}>Back to Topic</button>
          </div>
        </section>
      );
    }

    const q = quiz[currentQ];
    return (
      <section style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
        <button onClick={backToTopics} style={{ marginBottom: 12 }}>Back to topics</button>
        <h3 style={{ margin: 0 }}>Quiz — {selectedTopic.title}</h3>
        <div style={{ fontSize: 13, opacity: 0.7, marginTop: 4 }}>
          Question {currentQ + 1} of {quiz.length}
        </div>

        <div style={{ marginTop: 12, fontWeight: 600 }}>{q.question}</div>

        <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
          {q.options.map((opt, idx) => {
            let bg = undefined;
            if (selected !== null) {
              if (idx === q.answer) bg = "#d4edda";
              else if (idx === selected && idx !== q.answer) bg = "#f8d7da";
            }

            return (
              <div
                key={idx}
                onClick={() => pickAnswer(idx)}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: 6,
                  padding: "8px 12px",
                  cursor: selected !== null ? "default" : "pointer",
                  backgroundColor: bg,
                }}
              >
                {opt}
              </div>
            );
          })}
        </div>

        {selected !== null && (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 14, marginBottom: 8 }}>
              {selected === q.answer ? "Correct!" : `Incorrect — the answer is: ${q.options[q.answer]}`}
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
    <section style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
      <button onClick={backToTopics} style={{ marginBottom: 12 }}>Back to topics</button>
      <h3 style={{ margin: 0 }}>{selectedTopic.title}</h3>

      <div style={{ marginTop: 12 }}>
        {selectedTopic.content.map((para, i) => (
          <p key={i} style={{ lineHeight: 1.6, fontSize: 14 }}>{para}</p>
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
