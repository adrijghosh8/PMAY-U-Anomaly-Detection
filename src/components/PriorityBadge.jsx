const CLASS_BY_PRIORITY = {
  Critical: "badge-critical",
  High: "badge-high",
  Moderate: "badge-moderate",
  Low: "badge-low",
};

export default function PriorityBadge({ priority }) {
  const className = CLASS_BY_PRIORITY[priority] || "badge-low";
  return <span className={`badge ${className}`}>{priority}</span>;
}
