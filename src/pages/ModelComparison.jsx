import PageHeader from "../components/PageHeader";
import FigureCard from "../components/FigureCard";
import Callout from "../components/Callout";
import modelComparison from "../data/model_comparison.json";
import detectionSummary from "../data/detection_summary.json";

export default function ModelComparison() {
  return (
    <div>
      <PageHeader eyebrow="Model Comparison">
        <h1>Choosing a detection model</h1>
        <p>
          Three unsupervised anomaly detection methods were evaluated. The
          dataset has no ground-truth corruption or anomaly labels, so
          conventional metrics like accuracy or precision could not be used.
        </p>
      </PageHeader>

      <div className="section">
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Model</th>
                <th>Selected configuration</th>
                <th className="num">Top-5% stability</th>
                <th className="num">Stability (SD)</th>
              </tr>
            </thead>
            <tbody>
              {modelComparison.map((m) => (
                <tr key={m.model}>
                  <td>
                    {m.model}
                    {m.model === "One-Class SVM" && (
                      <span
                        className="badge badge-moderate"
                        style={{ marginLeft: "8px" }}
                      >
                        Selected
                      </span>
                    )}
                  </td>
                  <td className="mono">{m.configuration}</td>
                  <td className="num mono">{m.stability.toFixed(4)}</td>
                  <td className="num mono">{m.stabilitySd.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="section">
        <div className="section-title">
          <h3>Ranking stability under perturbation</h3>
        </div>
        <p className="muted" style={{ fontSize: "var(--text-sm)" }}>
          Each model was run repeatedly on perturbed versions of the
          dataset. A model whose top-ranked anomalies stay consistent
          across runs is considered more reliable for investigation
          purposes.
        </p>
        <FigureCard
          src="/figures/model_stability_comparison.png"
          alt="Bar chart comparing top-5% ranking stability across Isolation Forest, LOF, and One-Class SVM"
          caption="Top-5% ranking stability by model"
        />
      </div>

      <div className="section card">
        <h3>Selected model: One-Class SVM</h3>
        <div className="def-list">
          <div className="def-item">
            <span className="def-term">Kernel</span>
            <span className="mono">{detectionSummary.Kernel}</span>
          </div>
          <div className="def-item">
            <span className="def-term">Nu</span>
            <span className="mono">{detectionSummary.Nu}</span>
          </div>
          <div className="def-item">
            <span className="def-term">Gamma</span>
            <span className="mono">{detectionSummary.Gamma}</span>
          </div>
          <div className="def-item">
            <span className="def-term">Observed stability</span>
            <span className="mono">1.0000</span>
          </div>
        </div>
        <p style={{ marginTop: "var(--space-4)", marginBottom: 0 }}>
          An extended search over nu and gamma found this configuration
          produced identical top-5% anomaly rankings across every evaluated
          perturbation run. This reflects ranking consistency, not
          classification accuracy — there is no ground truth to be
          "accurate" against.
        </p>
      </div>

      <Callout muted>
        Model selection was based entirely on ranking stability, because no
        ground-truth anomaly or corruption labels exist for this dataset.
        A stability score of 1.0000 means rankings were consistent across
        perturbations — it is not a measure of correctness.
      </Callout>
    </div>
  );
}
