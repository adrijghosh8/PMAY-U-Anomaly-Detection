import { useState } from "react";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import FigureCard from "../components/FigureCard";
import datasetSummary from "../data/dataset_summary.json";

const NUMERICAL_FEATURES = [
  "Investment",
  "Central Assistance Sanctioned",
  "Central Assistance Released",
  "Houses Sanctioned",
  "Houses Grounded",
  "Houses Completed",
];

const CATEGORICAL_FIELDS = ["Country", "State", "Year", "City"];

const FEATURE_FIGURES = [
  { key: "investment", label: "Investment", file: "investment_distribution.png" },
  {
    key: "cas",
    label: "Central Assistance Sanctioned",
    file: "central_assistance_sanctioned_distribution.png",
  },
  {
    key: "car",
    label: "Central Assistance Released",
    file: "central_assistance_released_distribution.png",
  },
  {
    key: "hs",
    label: "Houses Sanctioned",
    file: "houses_sanctioned_distribution.png",
  },
  {
    key: "hg",
    label: "Houses Grounded",
    file: "houses_grounded_distribution.png",
  },
  {
    key: "hc",
    label: "Houses Completed",
    file: "houses_completed_distribution.png",
  },
];

export default function Dataset() {
  const [activeFeature, setActiveFeature] = useState(FEATURE_FIGURES[0].key);
  const active = FEATURE_FIGURES.find((f) => f.key === activeFeature);

  return (
    <div>
      <PageHeader eyebrow="Dataset">
        <h1>PMAY-U 2025</h1>
        <p>
          The raw dataset behind the model — its size, fields, and data
          quality, before any preprocessing was applied.
        </p>
      </PageHeader>

      <div className="section">
        <div className="grid grid-4">
          <StatCard
            value={datasetSummary["Total observations"]}
            label="Total observations"
          />
          <StatCard
            value={datasetSummary["Total original attributes"]}
            label="Original attributes"
          />
          <StatCard
            value={datasetSummary["Numerical modeling features"]}
            label="Numerical model features"
          />
          <StatCard
            value={datasetSummary["Missing values in numerical features"]}
            label="Missing values (numerical)"
          />
        </div>
      </div>

      <div className="section grid grid-2">
        <div className="card">
          <h3>Numerical model features</h3>
          <p className="muted" style={{ fontSize: "var(--text-sm)" }}>
            These six fields are the only inputs to the anomaly detection
            model. No additional engineered features were introduced.
          </p>
          <ul style={{ margin: 0, paddingLeft: "1.2em" }}>
            {NUMERICAL_FEATURES.map((f) => (
              <li key={f} style={{ marginBottom: "6px" }}>
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h3>Categorical / context fields</h3>
          <p className="muted" style={{ fontSize: "var(--text-sm)" }}>
            These fields provide context for each record — such as where an
            anomaly candidate is located — but are not used by the model
            itself.
          </p>
          <ul style={{ margin: 0, paddingLeft: "1.2em" }}>
            {CATEGORICAL_FIELDS.map((f) => (
              <li key={f} style={{ marginBottom: "6px" }}>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="section">
        <div className="section-title">
          <h3>Missing values</h3>
        </div>
        <p className="muted" style={{ fontSize: "var(--text-sm)" }}>
          Missing numerical values were not treated as zero, since
          missingness does not necessarily mean a true value of zero. They
          were handled with median imputation as part of preprocessing.
        </p>
        <FigureCard
          src="/figures/missing_values_before_preprocessing.png"
          alt="Bar chart of missing values per numerical feature before preprocessing"
          caption="Missing values by feature, before preprocessing"
        />
      </div>

      <div className="section">
        <div className="section-title">
          <h3>Feature correlation</h3>
        </div>
        <p className="muted" style={{ fontSize: "var(--text-sm)" }}>
          Correlation between the six numerical model features, computed on
          the raw dataset.
        </p>
        <FigureCard
          src="/figures/numerical_feature_correlation.png"
          alt="Correlation matrix of the six numerical model features"
          caption="Pearson correlation, numerical model features"
        />
      </div>

      <div className="section">
        <div className="section-title">
          <h3>Feature distributions</h3>
        </div>
        <p className="muted" style={{ fontSize: "var(--text-sm)" }}>
          Distribution of each numerical feature across the full dataset.
        </p>
        <div className="tabs">
          {FEATURE_FIGURES.map((f) => (
            <button
              key={f.key}
              className={`tab-button ${
                activeFeature === f.key ? "is-active" : ""
              }`}
              onClick={() => setActiveFeature(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <FigureCard
          src={`/figures/${active.file}`}
          alt={`Distribution of ${active.label}`}
          caption={`${active.label} — full dataset`}
        />
      </div>
    </div>
  );
}
