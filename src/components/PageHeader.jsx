export default function PageHeader({ eyebrow, title, children }) {
  return (
    <div className="page-header">
      {eyebrow && <div className="page-header-eyebrow">{eyebrow}</div>}
      <h1>{title}</h1>
      {children}
    </div>
  );
}
