import { useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import PriorityBadge from "../components/PriorityBadge";
import Modal from "../components/Modal";
import HorizontalBarChart from "../components/HorizontalBarChart";
import top20 from "../data/top20_anomalies.json";
import explanations from "../data/top10_explanations.json";
import { formatFeatureName, formatNumber, formatScore } from "../utils/format";

const COLUMNS = [
  { key: "rank", label: "Rank", num: true },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "investment", label: "Investment", num: true },
  { key: "centralAssistanceSanctioned", label: "CA Sanctioned", num: true },
  { key: "centralAssistanceReleased", label: "CA Released", num: true },
  { key: "housesSanctioned", label: "Houses Sanctioned", num: true },
  { key: "housesGrounded", label: "Houses Grounded", num: true },
  { key: "housesCompleted", label: "Houses Completed", num: true },
  { key: "anomalyScore", label: "Anomaly Score", num: true },
  { key: "priority", label: "Priority" },
];

const PRIORITIES = ["All", "Critical", "High", "Moderate", "Low"];

export default function TopAnomalies() {
  const [query, setQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortKey, setSortKey] = useState("rank");
  const [sortDir, setSortDir] = useState("asc");
  const [selected, setSelected] = useState(null);

  const rows = useMemo(() => {
    let result = top20.filter((r) => {
      const matchesQuery =
        query.trim() === "" ||
        r.city.toLowerCase().includes(query.toLowerCase()) ||
        r.state.toLowerCase().includes(query.toLowerCase());
      const matchesPriority =
        priorityFilter === "All" || r.priority === priorityFilter;
      return matchesQuery && matchesPriority;
    });

    result = [...result].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "string") {
        return sortDir === "asc"
          ? av.localeCompare(bv)
          : bv.localeCompare(av);
      }
      return sortDir === "asc" ? av - bv : bv - av;
    });

    return result;
  }, [query, priorityFilter, sortKey, sortDir]);

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const selectedExplanation = selected
    ? explanations.find((e) => e.rank === selected.rank)
    : null;

  return (
    <div>
      <PageHeader eyebrow="Top Anomalies">
        <h1>Anomaly candidates</h1>
        <p>
          The 20 highest-ranked anomaly candidates by anomaly score. These
          are statistically unusual observations flagged for investigation
          — not confirmed instances of wrongdoing. Select a row to see the
          full record.
        </p>
      </PageHeader>

      <div className="controls-row">
        <input
          className="search-input"
          type="text"
          placeholder="Search city or state…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="select-input"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p === "All" ? "All priorities" : p}
            </option>
          ))}
        </select>
        <span className="muted" style={{ fontSize: "var(--text-sm)" }}>
          {rows.length} of {top20.length} candidates
        </span>
      </div>

      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className={`sortable ${col.num ? "num" : ""}`}
                  onClick={() => handleSort(col.key)}
                >
                  {col.label}
                  {sortKey === col.key ? (sortDir === "asc" ? " ↑" : " ↓") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.rank} onClick={() => setSelected(r)}>
                <td className="num mono">{r.rank}</td>
                <td>{r.city}</td>
                <td>{r.state}</td>
                <td className="num mono">{formatNumber(r.investment)}</td>
                <td className="num mono">
                  {formatNumber(r.centralAssistanceSanctioned)}
                </td>
                <td className="num mono">
                  {formatNumber(r.centralAssistanceReleased)}
                </td>
                <td className="num mono">{formatNumber(r.housesSanctioned)}</td>
                <td className="num mono">{formatNumber(r.housesGrounded)}</td>
                <td className="num mono">{formatNumber(r.housesCompleted)}</td>
                <td className="num mono">{formatScore(r.anomalyScore)}</td>
                <td>
                  <PriorityBadge priority={r.priority} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <Modal onClose={() => setSelected(null)}>
          <div className="page-header-eyebrow">
            Rank #{selected.rank} · <PriorityBadge priority={selected.priority} />
          </div>
          <h3 style={{ marginBottom: "2px" }}>{selected.city}</h3>
          <p className="muted" style={{ fontSize: "var(--text-sm)" }}>
            {selected.state} · {selected.year}
          </p>

          <div className="def-list" style={{ marginTop: "var(--space-4)" }}>
            <div className="def-item">
              <span className="def-term">Anomaly score</span>
              <span className="mono">{formatScore(selected.anomalyScore)}</span>
            </div>
            <div className="def-item">
              <span className="def-term">Investment</span>
              <span className="mono">{formatNumber(selected.investment)}</span>
            </div>
            <div className="def-item">
              <span className="def-term">CA sanctioned</span>
              <span className="mono">
                {formatNumber(selected.centralAssistanceSanctioned)}
              </span>
            </div>
            <div className="def-item">
              <span className="def-term">CA released</span>
              <span className="mono">
                {formatNumber(selected.centralAssistanceReleased)}
              </span>
            </div>
            <div className="def-item">
              <span className="def-term">Houses sanctioned</span>
              <span className="mono">
                {formatNumber(selected.housesSanctioned)}
              </span>
            </div>
            <div className="def-item">
              <span className="def-term">Houses grounded</span>
              <span className="mono">
                {formatNumber(selected.housesGrounded)}
              </span>
            </div>
            <div className="def-item">
              <span className="def-term">Houses completed</span>
              <span className="mono">
                {formatNumber(selected.housesCompleted)}
              </span>
            </div>
          </div>

          <div className="hairline" />

          {selectedExplanation ? (
            <div>
              <h4>Feature influence</h4>
              <p className="muted" style={{ fontSize: "var(--text-sm)" }}>
                Change in anomaly score when each feature is replaced with
                its reference median. Larger bars indicate features the
                model relied on more heavily for this observation.
              </p>
              <HorizontalBarChart
                height={200}
                color="var(--color-high)"
                valueFormatter={(v) => v.toFixed(2)}
                data={[...selectedExplanation.features]
                  .sort((a, b) => b.absoluteInfluence - a.absoluteInfluence)
                  .map((f) => ({
                    label: formatFeatureName(f.feature),
                    value: f.absoluteInfluence,
                  }))}
              />
            </div>
          ) : (
            <p className="muted" style={{ fontSize: "var(--text-sm)", marginBottom: 0 }}>
              Detailed feature-influence explanations are available for the
              top 10 anomaly candidates. This record is ranked #{selected.rank}.
            </p>
          )}
        </Modal>
      )}
    </div>
  );
}
