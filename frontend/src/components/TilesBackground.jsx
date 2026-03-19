export default function TilesBackground({ rows = 10, cols = 12, className = "" }) {
  return (
    <div className={`tiles-surface ${className}`.trim()} aria-hidden="true">
      {Array.from({ length: rows * cols }).map((_, index) => (
        <span className="tile-cell" key={index} />
      ))}
    </div>
  );
}
