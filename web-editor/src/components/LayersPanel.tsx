import './LayersPanel.css';

export function LayersPanel() {
  return (
    <div className="layers-panel">
      <h2 className="panel-title">Layers</h2>
      <div className="layers-content">
        <p className="panel-empty">No layers yet. Import an SVG or Lottie file to get started.</p>
      </div>
    </div>
  );
}
