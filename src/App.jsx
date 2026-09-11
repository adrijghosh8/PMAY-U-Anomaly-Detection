import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Overview from "./pages/Overview";
import Dataset from "./pages/Dataset";
import ModelComparison from "./pages/ModelComparison";
import AnomalyAnalysis from "./pages/AnomalyAnalysis";
import TopAnomalies from "./pages/TopAnomalies";
import Explainability from "./pages/Explainability";
import Methodology from "./pages/Methodology";

export default function App() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="app-shell">
      <div className="mobile-topbar">
        <span className="mobile-topbar-brand">Anomaly Detector</span>
        <button
          className="mobile-menu-button"
          onClick={() => setMobileNavOpen((v) => !v)}
        >
          {mobileNavOpen ? "Close" : "Menu"}
        </button>
      </div>

      <Sidebar
        isOpen={mobileNavOpen}
        onNavigate={() => setMobileNavOpen(false)}
      />

      <div className="content-area">
        <div className="content-inner">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/dataset" element={<Dataset />} />
            <Route path="/models" element={<ModelComparison />} />
            <Route path="/anomalies" element={<AnomalyAnalysis />} />
            <Route path="/top-anomalies" element={<TopAnomalies />} />
            <Route path="/explainability" element={<Explainability />} />
            <Route path="/methodology" element={<Methodology />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
