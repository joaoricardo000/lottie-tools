import { create } from 'zustand';

/**
 * Project state interface
 */
interface ProjectState {
  name: string;
  width: number;
  height: number;
  fps: number;
  duration: number;
  currentTime: number;
  isPlaying: boolean;
}

/**
 * Store interface
 */
interface Store {
  // Project state
  project: ProjectState | null;

  // Actions
  setProject: (project: ProjectState) => void;
  updateProjectSettings: (settings: Partial<ProjectState>) => void;
  setCurrentTime: (time: number) => void;
  setIsPlaying: (playing: boolean) => void;
}

/**
 * Main application store
 */
export const useStore = create<Store>((set) => ({
  // Initial state
  project: {
    name: 'Untitled Project',
    width: 800,
    height: 600,
    fps: 30,
    duration: 5,
    currentTime: 0,
    isPlaying: false,
  },

  // Actions
  setProject: (project) => set({ project }),

  updateProjectSettings: (settings) =>
    set((state) => ({
      project: state.project ? { ...state.project, ...settings } : null,
    })),

  setCurrentTime: (time) =>
    set((state) => ({
      project: state.project ? { ...state.project, currentTime: time } : null,
    })),

  setIsPlaying: (playing) =>
    set((state) => ({
      project: state.project ? { ...state.project, isPlaying: playing } : null,
    })),
}));
