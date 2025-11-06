import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from './useStore';

describe('useStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useStore.setState({
      project: {
        name: 'Untitled Project',
        width: 800,
        height: 600,
        fps: 30,
        duration: 5,
        currentTime: 0,
        isPlaying: false,
      },
    });
  });

  describe('initial state', () => {
    it('should have default project settings', () => {
      const state = useStore.getState();
      expect(state.project).toEqual({
        name: 'Untitled Project',
        width: 800,
        height: 600,
        fps: 30,
        duration: 5,
        currentTime: 0,
        isPlaying: false,
      });
    });
  });

  describe('setProject', () => {
    it('should replace the entire project', () => {
      const newProject = {
        name: 'My Animation',
        width: 1920,
        height: 1080,
        fps: 60,
        duration: 10,
        currentTime: 2.5,
        isPlaying: true,
      };

      useStore.getState().setProject(newProject);

      expect(useStore.getState().project).toEqual(newProject);
    });
  });

  describe('updateProjectSettings', () => {
    it('should update specific project settings', () => {
      useStore.getState().updateProjectSettings({
        name: 'Updated Name',
        width: 1280,
      });

      const project = useStore.getState().project;
      expect(project?.name).toBe('Updated Name');
      expect(project?.width).toBe(1280);
      expect(project?.height).toBe(600); // unchanged
    });

    it('should handle null project gracefully', () => {
      useStore.setState({ project: null });

      useStore.getState().updateProjectSettings({ name: 'Test' });

      expect(useStore.getState().project).toBeNull();
    });
  });

  describe('setCurrentTime', () => {
    it('should update current time', () => {
      useStore.getState().setCurrentTime(2.5);

      expect(useStore.getState().project?.currentTime).toBe(2.5);
    });

    it('should handle null project gracefully', () => {
      useStore.setState({ project: null });

      useStore.getState().setCurrentTime(1.0);

      expect(useStore.getState().project).toBeNull();
    });
  });

  describe('setIsPlaying', () => {
    it('should toggle playing state to true', () => {
      useStore.getState().setIsPlaying(true);

      expect(useStore.getState().project?.isPlaying).toBe(true);
    });

    it('should toggle playing state to false', () => {
      useStore.getState().setIsPlaying(true);
      useStore.getState().setIsPlaying(false);

      expect(useStore.getState().project?.isPlaying).toBe(false);
    });

    it('should handle null project gracefully', () => {
      useStore.setState({ project: null });

      useStore.getState().setIsPlaying(true);

      expect(useStore.getState().project).toBeNull();
    });
  });
});
