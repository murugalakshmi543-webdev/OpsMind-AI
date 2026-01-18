export default function SourcesPanel({ sources }) {
  if (!sources.length) return null;

  return (
    <div className="sources">
      <h4>Sources</h4>
      {sources.map((s, i) => (
        <a
          key={i}
          href={`http://localhost:3000/api/file/${s.fileId}`}
          target="_blank"
        >
          {s.filename} — Page {s.page}
        </a>
      ))}
    </div>
  );
}
