import { useEffect, useRef, useState } from 'react';
import './Timeline.css';
import { useStore } from '../store/useStore';
import { PlaybackEngine } from '../engine/PlaybackEngine';

export function Timeline() {
  const project = useStore((state) => state.project);
  const setCurrentTime = useStore((state) => state.setCurrentTime);
  const setIsPlaying = useStore((state) => state.setIsPlaying);

  const [loop, setLoop] = useState(false);
  const engineRef = useRef<PlaybackEngine | null>(null);

  // Initialize PlaybackEngine
  useEffect(() => {
    if (!project) return;

    const engine = new PlaybackEngine({
      fps: project.fps,
      duration: project.duration,
      loop,
      onUpdate: (time) => {
        setCurrentTime(time);
      },
    });

    engineRef.current = engine;

    return () => {
      engine.stop();
    };
  }, [project?.fps, project?.duration, loop, setCurrentTime]);

  // Sync playback state with engine
  useEffect(() => {
    if (!engineRef.current || !project) return;

    if (project.isPlaying) {
      engineRef.current.play();
    } else {
      engineRef.current.pause();
    }
  }, [project?.isPlaying]);

  // Sync time when manually changed (e.g., scrubbing)
  useEffect(() => {
    if (!engineRef.current || !project) return;

    const currentEngineTime = engineRef.current.getCurrentTime();
    const timeDiff = Math.abs(currentEngineTime - project.currentTime);

    // Only seek if there's a significant difference (avoid feedback loop)
    if (timeDiff > 0.01 && !project.isPlaying) {
      engineRef.current.seek(project.currentTime);
    }
  }, [project?.currentTime, project?.isPlaying]);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (engineRef.current) {
      engineRef.current.seek(newTime);
    }
  };

  const togglePlayback = () => {
    setIsPlaying(!project?.isPlaying);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (engineRef.current) {
      engineRef.current.stop();
    }
  };

  const toggleLoop = () => {
    setLoop(!loop);
    if (engineRef.current) {
      engineRef.current.setLoop(!loop);
    }
  };

  const stepForward = () => {
    if (engineRef.current && project) {
      const frameDuration = 1 / project.fps;
      const newTime = Math.min(project.currentTime + frameDuration, project.duration);
      setCurrentTime(newTime);
      engineRef.current.seek(newTime);
    }
  };

  const stepBackward = () => {
    if (engineRef.current && project) {
      const frameDuration = 1 / project.fps;
      const newTime = Math.max(project.currentTime - frameDuration, 0);
      setCurrentTime(newTime);
      engineRef.current.seek(newTime);
    }
  };

  const currentFrame = project ? Math.floor(project.currentTime * project.fps) : 0;

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent shortcuts when typing in input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlayback();
          break;
        case 'ArrowRight':
          e.preventDefault();
          stepForward();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          stepBackward();
          break;
        case 'Home':
          e.preventDefault();
          if (project) {
            setCurrentTime(0);
            if (engineRef.current) {
              engineRef.current.seek(0);
            }
          }
          break;
        case 'End':
          e.preventDefault();
          if (project) {
            setCurrentTime(project.duration);
            if (engineRef.current) {
              engineRef.current.seek(project.duration);
            }
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, togglePlayback, stepForward, stepBackward, setCurrentTime]);

  return (
    <div className="timeline">
      <div className="timeline-controls">
        <button
          onClick={stepBackward}
          aria-label="Step backward"
          title="Previous frame"
        >
          ⏮
        </button>
        <button
          onClick={togglePlayback}
          aria-label={project?.isPlaying ? 'Pause' : 'Play'}
          title={project?.isPlaying ? 'Pause' : 'Play'}
        >
          {project?.isPlaying ? '⏸' : '▶'}
        </button>
        <button
          onClick={handleStop}
          aria-label="Stop"
          title="Stop and reset"
        >
          ⏹
        </button>
        <button
          onClick={stepForward}
          aria-label="Step forward"
          title="Next frame"
        >
          ⏭
        </button>
        <button
          onClick={toggleLoop}
          aria-label="Loop"
          title={loop ? 'Disable loop' : 'Enable loop'}
          data-loop={loop}
          className={loop ? 'active' : ''}
        >
          🔁
        </button>
        <span className="timeline-time">
          {project?.currentTime.toFixed(2)}s / {project?.duration.toFixed(2)}s
        </span>
        <span className="timeline-frame">
          Frame {currentFrame}
        </span>
        <span className="timeline-fps">
          {project?.fps} fps
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
