import { useStore } from '../store/useStore';
import './ProjectSettingsPanel.css';

export function ProjectSettingsPanel() {
  const project = useStore((state) => state.project);
  const updateProjectSettings = useStore((state) => state.updateProjectSettings);

  if (!project) {
    return null;
  }

  const handleChange = (field: string, value: string | number | boolean) => {
    updateProjectSettings({ [field]: value });
  };

  return (
    <div className="project-settings-panel">
      <h3 className="project-settings-title">Project Settings</h3>

      <div className="project-settings-section">
        <div className="project-setting-row">
          <label htmlFor="project-name">Project Name</label>
          <input
            id="project-name"
            type="text"
            value={project.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Untitled Project"
          />
        </div>
      </div>

      <div className="project-settings-section">
        <h4 className="section-subtitle">Canvas</h4>

        <div className="project-setting-row">
          <label htmlFor="canvas-width">Width</label>
          <input
            id="canvas-width"
            type="number"
            value={project.width}
            onChange={(e) => handleChange('width', parseInt(e.target.value) || 800)}
            min="1"
            max="10000"
          />
        </div>

        <div className="project-setting-row">
          <label htmlFor="canvas-height">Height</label>
          <input
            id="canvas-height"
            type="number"
            value={project.height}
            onChange={(e) => handleChange('height', parseInt(e.target.value) || 600)}
            min="1"
            max="10000"
          />
        </div>
      </div>

      <div className="project-settings-section">
        <h4 className="section-subtitle">Animation</h4>

        <div className="project-setting-row">
          <label htmlFor="project-fps">FPS</label>
          <input
            id="project-fps"
            type="number"
            value={project.fps}
            onChange={(e) => handleChange('fps', parseInt(e.target.value) || 30)}
            min="1"
            max="120"
          />
        </div>

        <div className="project-setting-row">
          <label htmlFor="project-duration">Duration (seconds)</label>
          <input
            id="project-duration"
            type="number"
            value={project.duration}
            onChange={(e) => handleChange('duration', parseFloat(e.target.value) || 1)}
            min="0.1"
            step="0.1"
          />
        </div>

        <div className="project-setting-row">
          <label htmlFor="project-loop">Loop Animation</label>
          <input
            id="project-loop"
            type="checkbox"
            checked={project.loop}
            onChange={(e) => handleChange('loop', e.target.checked)}
          />
        </div>
      </div>
    </div>
  );
}
