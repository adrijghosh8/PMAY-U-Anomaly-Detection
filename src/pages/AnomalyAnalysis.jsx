import { useState } from "react";
import PageHeader from "../components/PageHeader";
import FigureCard from "../components/FigureCard";
import anomalyVsNormal from "../data/anomaly_vs_normal_stats.json";
import { formatFeatureName, formatNumber } from "../utils/format";

const PRIORITY_LEVELS = [
  {
    name: "Critical",
    range: "Top 1%",
    className: "badge-critical",
    description: "The most statistically unusual observations in the dataset.",
  },
  {
    name: "High",
    range: "Top 5%",
    className: "badge-high",
    description: "Substantially unusual, warranting closer review.",
  },
  {
    name: "Moderate",
    range: "Top 10%",
    className: "badge-moderate",
    description: "Noticeably unusual relative to the typical pattern.",
  },
  {
    name: "Low",
    range: "Remaining observations",
    className: "badge-low",
    description: "Consistent with the typical pattern in the dataset.",
  },
];

const TABS = [
  { key: "distributions", label: "Anomaly vs. Normal" },
  { key: "influence", label: "Feature Influence" },
  { key: "geography", label: "Geographic Distribution" },
];

export default function AnomalyAnalysis() {
  const [tab, setTab] = useState(TABS[0].key);

  return (
    <div>
      <PageHeader eyebrow="Anomaly Analysis">
        <h1>What makes an observation anomalous</h1>
        <p>
          Higher anomaly scores indicate observations that are more
          statistically unusual according to the selected model. This page
          compares anomalous and normal records and shows which features
          drive the difference.
        </p>
      </PageHeader>

      <div className="section">
        <div className="section-title">
          <h3>Investigation priority levels</h3>
        </div>
        <div className="grid grid-4">
          {PRIORITY_LEVELS.map((p) => (
            <div className="card" key={p.name}>
              <span className={`badge ${p.className}`}>{p.name}</span>
              <div
                className="mono muted"
                style={{ margin: "var(--space-3) 0 var(--space-2)", fontSize: "var(--text-sm)" }}
              >
                {p.range}
              </div>
              <p style={{ marginBottom: 0, fontSize: "var(--text-sm)" }}>
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`tab-button ${tab === t.key ? "is-active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "distributions" && (
          <div>
            <p className="muted" style={{ fontSize: "var(--text-sm)" }}>
              Distribution of each numerical feature, separated by whether
              the observation was labeled Normal or Anomaly.
            </p>
            <FigureCard
              src="/figures/anomaly_vs_normal_feature_distributions.png"
              alt="Feature distributions compared between normal and anomalous observations"
              caption="Feature distributions by label"
            />
            <div className="hairline" />
            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th className="num">Normal median</th>
                    <th className="num">Anomaly median</th>
                    <th className="num">Normal mean</th>
                    <th className="num">Anomaly mean</th>
                    <th className="num">Normal 95th pct.</th>
                    <th className="num">Anomaly 95th pct.</th>
                  </tr>
                </thead>
                <tbody>
                  {anomalyVsNormal.map((r) => (
                    <tr key={r.feature}>
                      <td>{formatFeatureName(r.feature)}</td>
                      <td className="num mono">{formatNumber(r.normalMedian)}</td>
                      <td className="num mono">{formatNumber(r.anomalyMedian)}</td>
                      <td className="num mono">{formatNumber(r.normalMean)}</td>
                      <td className="num mono">{formatNumber(r.anomalyMean)}</td>
                      <td className="num mono">{formatNumber(r.normal95th)}</td>
                      <td className="num mono">{formatNumber(r.anomaly95th)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p
              className="muted"
              style={{ fontSize: "var(--text-sm)", marginTop: "var(--space-4)", marginBottom: 0 }}
            >
              Anomaly-group medians do not consistently exceed normal-group
              medians — the difference is most visible in the mean and
              upper percentiles, where a subset of very large observations
              pulls the anomaly group's numbers up.
            </p>
          </div>
        )}

        {tab === "influence" && (
          <div>
            <p className="muted" style={{ fontSize: "var(--text-sm)" }}>
              Feature influence for the ten highest-ranked anomalies, based
              on one-feature-at-a-time median perturbation. See{" "}
              <a href="/explainability">Explainability</a> for the full
              breakdown.
            </p>
            <FigureCard
              src="/figures/feature_influence_top10.png"
              alt="Feature influence for the top 10 anomaly candidates"
              caption="Feature influence, top 10 anomaly candidates"
            />
          </div>
        )}

        {tab === "geography" && (
          <div>
            <p className="muted" style={{ fontSize: "var(--text-sm)" }}>
              Anomaly rate by state — the share of each state's
              observations flagged as anomalous. See{" "}
              <a href="/top-anomalies">Top Anomalies</a> for individual
              records.
            </p>
            <FigureCard
              src="/figures/state_anomaly_rates.png"
              alt="Anomaly rate by state"
              caption="Anomaly rate by state"
            />
            <div className="hairline" />
            <FigureCard
              src="/figures/top20_anomaly_candidates.png"
              alt="Top 20 anomaly candidates by anomaly score"
              caption="Top 20 anomaly candidates by score"
            />
          </div>
        )}
      </div>
    </div>
  );
}
