import './Canvas.css';
import { useStore } from '../store/useStore';

export function Canvas() {
  const project = useStore((state) => state.project);

  return (
    <div className="canvas-container">
      <div className="canvas-wrapper">
        <canvas
          className="canvas"
          width={project?.width || 800}
          height={project?.height || 600}
        />
        <div className="canvas-info">
          {project?.width} × {project?.height}px @ {project?.fps}fps
        </div>
      </div>
    </div>
  );
}
