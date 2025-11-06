import './PropertiesPanel.css';
import { useStore } from '../store/useStore';

export function PropertiesPanel() {
  const project = useStore((state) => state.project);
  const updateProjectSettings = useStore((state) => state.updateProjectSettings);

  return (
    <div className="properties-panel">
      <h2 className="panel-title">Properties</h2>
      <div className="properties-content">
        {project ? (
          <div className="property-group">
            <label>
              Name:
              <input
                type="text"
                value={project.name}
                onChange={(e) => updateProjectSettings({ name: e.target.value })}
              />
            </label>
            <label>
              Width:
              <input
                type="number"
                value={project.width}
                onChange={(e) =>
                  updateProjectSettings({ width: parseInt(e.target.value) })
                }
              />
            </label>
            <label>
              Height:
              <input
                type="number"
                value={project.height}
                onChange={(e) =>
                  updateProjectSettings({ height: parseInt(e.target.value) })
                }
              />
            </label>
            <label>
              FPS:
              <input
                type="number"
                value={project.fps}
                onChange={(e) =>
                  updateProjectSettings({ fps: parseInt(e.target.value) })
                }
              />
            </label>
            <label>
              Duration (s):
              <input
                type="number"
                step="0.1"
                value={project.duration}
                onChange={(e) =>
                  updateProjectSettings({ duration: parseFloat(e.target.value) })
                }
              />
            </label>
          </div>
        ) : (
          <p className="panel-empty">No project loaded</p>
        )}
      </div>
    </div>
  );
}
