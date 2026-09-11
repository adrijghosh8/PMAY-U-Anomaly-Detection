export function formatNumber(value, opts = {}) {
  if (value === null || value === undefined) return "—";
  return Number(value).toLocaleString("en-IN", opts);
}

export function formatScore(value) {
  if (value === null || value === undefined) return "—";
  return Number(value).toFixed(2);
}

export function formatFeatureName(raw) {
  return raw.replaceAll("_", " ").replace(/^\w/, (c) => c.toUpperCase());
}
