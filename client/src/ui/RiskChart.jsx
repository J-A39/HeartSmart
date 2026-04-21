import React from "react";

// simple SVG line chart — no dependencies
export default function RiskChart({ history }) {
  // grab entries that have a valid risk score, oldest first
  const points = (history || [])
    .filter((r) => r.rawMlResponse?.risk != null)
    .slice()
    .reverse()
    .map((r) => ({
      date: new Date(r.createdAt),
      risk: r.rawMlResponse.risk * 100,
    }));

  if (points.length < 2) return null;

  const W = 600;
  const H = 200;
  const PAD_L = 45;
  const PAD_R = 20;
  const PAD_T = 20;
  const PAD_B = 32;

  const chartW = W - PAD_L - PAD_R;
  const chartH = H - PAD_T - PAD_B;

  const minR = Math.max(0, Math.floor(Math.min(...points.map((p) => p.risk)) - 5));
  const maxR = Math.min(100, Math.ceil(Math.max(...points.map((p) => p.risk)) + 5));
  const rangeR = maxR - minR || 1;

  function x(i) {
    return PAD_L + (i / (points.length - 1)) * chartW;
  }

  function y(risk) {
    return PAD_T + chartH - ((risk - minR) / rangeR) * chartH;
  }

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.risk).toFixed(1)}`).join(" ");

  // y-axis labels (3-4 ticks)
  const tickCount = 4;
  const yTicks = [];
  for (let i = 0; i <= tickCount; i++) {
    const val = minR + (rangeR * i) / tickCount;
    yTicks.push(val);
  }

  // x-axis labels — first, middle, last
  const xLabels = [0];
  if (points.length > 2) xLabels.push(Math.floor(points.length / 2));
  xLabels.push(points.length - 1);

  function shortDate(d) {
    return d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
  }

  return (
    <div className="card" style={{ marginBottom: 12, padding: 16 }}>
      <h4 style={{ marginBottom: 12 }}>Risk Over Time</h4>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
        {/* grid lines */}
        {yTicks.map((val) => (
          <line
            key={val}
            x1={PAD_L}
            y1={y(val)}
            x2={W - PAD_R}
            y2={y(val)}
            stroke="var(--border)"
            strokeWidth="1"
          />
        ))}

        {/* y-axis labels */}
        {yTicks.map((val) => (
          <text
            key={val}
            x={PAD_L - 8}
            y={y(val) + 4}
            textAnchor="end"
            fontSize="11"
            fill="var(--text-muted)"
          >
            {val.toFixed(0)}%
          </text>
        ))}

        {/* x-axis labels */}
        {xLabels.map((i) => (
          <text
            key={i}
            x={x(i)}
            y={H - 6}
            textAnchor="middle"
            fontSize="11"
            fill="var(--text-muted)"
          >
            {shortDate(points[i].date)}
          </text>
        ))}

        {/* line */}
        <path d={linePath} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* dots */}
        {points.map((p, i) => (
          <circle key={i} cx={x(i)} cy={y(p.risk)} r="4" fill="var(--accent)" />
        ))}
      </svg>
    </div>
  );
}
