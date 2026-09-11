export default function Callout({ children, muted = false }) {
  return (
    <div className={`callout ${muted ? "callout-muted" : ""}`}>
      <p>{children}</p>
    </div>
  );
}
