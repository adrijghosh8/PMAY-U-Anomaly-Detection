import PageHeader from "../components/PageHeader";
import Callout from "../components/Callout";

const STAGES = [
  {
    title: "Raw PMAY-U 2025 dataset",
    body: "5,113 observations across 10 original attributes, covering investment, central assistance, and housing progress by city and state.",
  },
  {
    title: "Data validation",
    body: "The dataset was checked for duplicate records and logical inconsistencies between housing fields. None were found.",
  },
  {
    title: "Missing value handling",
    body: "363 missing values across three numerical features were median-imputed rather than treated as zero, since missingness does not imply a true zero.",
  },
  {
    title: "Yeo-Johnson transformation",
    body: "A power transformation was applied to the six numerical features to reduce skew before scaling.",
  },
  {
    title: "Robust scaling",
    body: "Features were scaled using statistics robust to outliers, so a small number of extreme values would not dominate the scale.",
  },
  {
    title: "Anomaly detection",
    body: "Isolation Forest, Local Outlier Factor, and One-Class SVM were each fit to the preprocessed features.",
  },
  {
    title: "Model comparison",
    body: "Each model's top-5% anomaly ranking was tested for stability under repeated perturbations, since no ground-truth labels exist to score against.",
  },
  {
    title: "One-Class SVM selection",
    body: "One-Class SVM (RBF kernel, nu = 0.15, gamma = 0.05) was selected for its observed ranking stability of 1.0000 across evaluated runs.",
  },
  {
    title: "Anomaly ranking",
    body: "All 5,113 observations were scored and ranked, yielding 766 anomaly candidates (14.98%) and 4,347 normal records.",
  },
  {
    title: "Explainability",
    body: "A one-feature-at-a-time median perturbation method was used to measure each feature's influence on the anomaly score of top-ranked candidates.",
  },
  {
    title: "Investigation priority",
    body: "Anomaly candidates were grouped into Critical (top 1%), High (top 5%), Moderate (top 10%), and Low tiers to support prioritized review.",
  },
];

const LIMITATIONS = [
  "No ground-truth anomaly or corruption labels exist for this dataset.",
  "A statistical anomaly is not equivalent to corruption or wrongdoing.",
  "Results depend on the dataset and the preprocessing choices made.",
  "Large or extreme observations can receive high anomaly scores simply due to scale.",
  "Human and administrative investigation is required to draw conclusions about any individual record.",
];

export default function Methodology() {
  return (
    <div>
      <PageHeader eyebrow="Methodology">
        <h1>The analysis pipeline</h1>
        <p>
          Every stage the data passes through, from the raw dataset to a
          ranked, explained list of anomaly candidates.
        </p>
      </PageHeader>

      <div className="section pipeline">
        {STAGES.map((stage, i) => (
          <div className="pipeline-stage" key={stage.title}>
            <div className="pipeline-marker">
              <div className="pipeline-dot" />
              {i < STAGES.length - 1 && <div className="pipeline-line" />}
            </div>
            <div className="pipeline-stage-body">
              <h4>{stage.title}</h4>
              <p>{stage.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="section">
        <div className="section-title">
          <h3>Limitations</h3>
        </div>
        <div className="card">
          <ul style={{ margin: 0, paddingLeft: "1.2em" }}>
            {LIMITATIONS.map((l) => (
              <li key={l} style={{ marginBottom: "10px" }}>
                {l}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Callout>
        This system identifies statistically unusual observations that may
        be prioritized for further investigation. It does not, on its own,
        establish that any observation reflects corruption or wrongdoing.
      </Callout>
    </div>
  );
}
