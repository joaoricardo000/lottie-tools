import './Timeline.css';
import { useStore } from '../store/useStore';

export function Timeline() {
  const project = useStore((state) => state.project);
  const setCurrentTime = useStore((state) => state.setCurrentTime);
  const setIsPlaying = useStore((state) => state.setIsPlaying);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(parseFloat(e.target.value));
  };

  const togglePlayback = () => {
    setIsPlaying(!project?.isPlaying);
  };

  return (
    <div className="timeline">
      <div className="timeline-controls">
        <button onClick={togglePlayback}>
          {project?.isPlaying ? '⏸' : '▶'}
        </button>
        <span className="timeline-time">
          {project?.currentTime.toFixed(2)}s / {project?.duration.toFixed(2)}s
        </span>
      </div>
      <div className="timeline-scrubber">
        <input
          type="range"
          min="0"
          max={project?.duration || 5}
          step="0.01"
          value={project?.currentTime || 0}
          onChange={handleTimeChange}
          className="timeline-slider"
        />
      </div>
    </div>
  );
}
