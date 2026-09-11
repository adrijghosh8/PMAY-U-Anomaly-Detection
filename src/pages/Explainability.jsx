import { useState } from "react";
import PageHeader from "../components/PageHeader";
import Callout from "../components/Callout";
import HorizontalBarChart from "../components/HorizontalBarChart";
import featureInfluence from "../data/feature_influence.json";
import explanations from "../data/top10_explanations.json";
import { formatFeatureName, formatNumber, formatScore } from "../utils/format";

export default function Explainability() {
  const [selectedRank, setSelectedRank] = useState(explanations[0].rank);
  const current = explanations.find((e) => e.rank === selectedRank);

  return (
    <div>
      <PageHeader eyebrow="Explainability">
        <h1>Why an observation was flagged</h1>
        <p>
          Explanations are generated with a model-agnostic,
          one-feature-at-a-time median perturbation method: each feature is
          replaced with its typical (median) value while the rest of the
          record stays the same, and the resulting change in anomaly score
          is recorded as that feature's influence.
        </p>
      </PageHeader>

      <Callout>
        This is a diagnostic explanation of the fitted model's behavior,
        not a causal explanation. It does not establish that a feature
        caused an observation to become anomalous.
      </Callout>

      <div className="section" style={{ marginTop: "var(--space-6)" }}>
        <div className="section-title">
          <h3>Overall feature influence</h3>
        </div>
        <p className="muted" style={{ fontSize: "var(--text-sm)" }}>
          Average absolute influence across the ten highest-ranked anomaly
          candidates.
        </p>
        <div className="card">
          <HorizontalBarChart
            height={260}
            valueFormatter={(v) => v.toFixed(2)}
            data={featureInfluence.map((f) => ({
              label: formatFeatureName(f.feature),
              value: f.meanInfluence,
            }))}
          />
        </div>
      </div>

      <div className="section">
        <div className="section-title">
          <h3>Explanation for an individual anomaly candidate</h3>
        </div>
        <div className="controls-row">
          <select
            className="select-input"
            value={selectedRank}
            onChange={(e) => setSelectedRank(Number(e.target.value))}
          >
            {explanations.map((e) => (
              <option key={e.rank} value={e.rank}>
                #{e.rank} — {e.city}
              </option>
            ))}
          </select>
        </div>

        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th className="num">Original value</th>
                <th className="num">Reference median</th>
                <th className="num">Score change</th>
                <th className="num">Influence</th>
              </tr>
            </thead>
            <tbody>
              {[...current.features]
                .sort((a, b) => b.absoluteInfluence - a.absoluteInfluence)
                .map((f) => (
                  <tr key={f.feature}>
                    <td>{formatFeatureName(f.feature)}</td>
                    <td className="num mono">{formatNumber(f.originalValue)}</td>
                    <td className="num mono">{formatNumber(f.referenceMedian)}</td>
                    <td className="num mono">{formatScore(f.scoreChange)}</td>
                    <td className="num mono">{formatScore(f.absoluteInfluence)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="section card">
        <h4>How to interpret this table</h4>
        <p style={{ marginBottom: 0 }}>
          "Score change" is the anomaly score after the feature is reset to
          its reference median, minus the original score. A large positive
          change means that feature's unusual value was pushing the score
          up; "influence" is simply its absolute size, used for ranking.
          This tells us how the model's score responds to each feature —
          it does not tell us why the underlying value was unusual.
        </p>
      </div>
    </div>
  );
}
