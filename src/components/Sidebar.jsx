import { NavLink } from "react-router-dom";

// Edit this list to add, remove, or reorder pages in the sidebar.
// "to" must match the route defined in App.jsx.
const NAV_ITEMS = [
  { to: "/", label: "Overview", index: "01" },
  { to: "/dataset", label: "Dataset", index: "02" },
  { to: "/models", label: "Model Comparison", index: "03" },
  { to: "/anomalies", label: "Anomaly Analysis", index: "04" },
  { to: "/top-anomalies", label: "Top Anomalies", index: "05" },
  { to: "/explainability", label: "Explainability", index: "06" },
  { to: "/methodology", label: "Methodology", index: "07" },
];

export default function Sidebar({ isOpen, onNavigate }) {
  return (
    <aside className={`sidebar ${isOpen ? "is-open" : ""}`}>
      <NavLink to="/" className="sidebar-brand" onClick={onNavigate}>
        <span className="sidebar-brand-mark">Anomaly Detector</span>
        <span className="sidebar-brand-sub">PMAY-U 2025</span>
      </NavLink>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            onClick={onNavigate}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "is-active" : ""}`
            }
          >
            <span className="sidebar-link-index">{item.index}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        Unsupervised anomaly screening &amp; investigation-support
        dashboard. Findings indicate statistical unusualness, not
        confirmed wrongdoing.
      </div>
    </aside>
  );
}
