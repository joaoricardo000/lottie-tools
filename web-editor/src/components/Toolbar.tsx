import './Toolbar.css';

export function Toolbar() {
  return (
    <div className="toolbar">
      <h1 className="toolbar-title">Lottie Open Studio</h1>
      <div className="toolbar-actions">
        <button>Import SVG</button>
        <button>Import Lottie</button>
        <button>Export</button>
      </div>
    </div>
  );
}
