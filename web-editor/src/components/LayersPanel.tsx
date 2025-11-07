import { useState } from 'react';
import { useStore } from '../store/useStore';
import './LayersPanel.css';

export function LayersPanel() {
  const project = useStore((state) => state.project);
  const toggleLayerVisibility = useStore((state) => state.toggleLayerVisibility);
  const toggleLayerLock = useStore((state) => state.toggleLayerLock);
  const selectLayer = useStore((state) => state.selectLayer);
  const renameLayer = useStore((state) => state.renameLayer);

  const [editingLayerId, setEditingLayerId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const hasLayers = project && project.layers.length > 0;

  const handleStartEdit = (layerId: string, currentName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingLayerId(layerId);
    setEditingName(currentName);
  };

  const handleFinishEdit = (layerId: string) => {
    if (editingName.trim() !== '') {
      renameLayer(layerId, editingName.trim());
    }
    setEditingLayerId(null);
    setEditingName('');
  };

  const handleKeyDown = (e: React.KeyboardEvent, layerId: string) => {
    if (e.key === 'Enter') {
      handleFinishEdit(layerId);
    } else if (e.key === 'Escape') {
      setEditingLayerId(null);
      setEditingName('');
    }
  };

  return (
    <div className="layers-panel">
      <h2 className="panel-title">Layers</h2>
      <div className="layers-content">
        {!hasLayers ? (
          <p className="panel-empty">No layers yet. Import an SVG or Lottie file to get started.</p>
        ) : (
          <ul className="layers-list">
            {project.layers.map((layer) => (
              <li
                key={layer.id}
                className={`layer-item ${project.selectedLayerId === layer.id ? 'selected' : ''}`}
                onClick={() => selectLayer(layer.id)}
              >
                <div className="layer-info">
                  {editingLayerId === layer.id ? (
                    <input
                      type="text"
                      className="layer-name-input"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={() => handleFinishEdit(layer.id)}
                      onKeyDown={(e) => handleKeyDown(e, layer.id)}
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span
                      className="layer-name"
                      onDoubleClick={(e) => handleStartEdit(layer.id, layer.name, e)}
                    >
                      {layer.name}
                    </span>
                  )}
                  <span className="layer-type">{layer.element.type}</span>
                </div>
                <div className="layer-controls">
                  <button
                    className="layer-control-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLayerVisibility(layer.id);
                    }}
                    aria-label="Toggle visibility"
                    data-visible={layer.visible}
                  >
                    {layer.visible ? '👁' : '👁‍🗨'}
                  </button>
                  <button
                    className="layer-control-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLayerLock(layer.id);
                    }}
                    aria-label="Toggle lock"
                    data-locked={layer.locked}
                  >
                    {layer.locked ? '🔒' : '🔓'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
