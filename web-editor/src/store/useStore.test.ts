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
        layers: [],
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
        layers: [],
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

  describe('toggleLayerVisibility', () => {
    it('should toggle layer visibility from true to false', () => {
      useStore.setState({
        project: {
          name: 'Test',
          width: 800,
          height: 600,
          fps: 30,
          duration: 3,
          currentTime: 0,
          isPlaying: false,
          layers: [
            {
              id: 'layer1',
              name: 'Layer 1',
              element: {
                id: 'rect1',
                type: 'rect',
                name: 'Rect',
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 },
                style: {},
              },
              visible: true,
              locked: false,
            },
          ],
        },
      });

      useStore.getState().toggleLayerVisibility('layer1');

      expect(useStore.getState().project?.layers[0].visible).toBe(false);
    });

    it('should toggle layer visibility from false to true', () => {
      useStore.setState({
        project: {
          name: 'Test',
          width: 800,
          height: 600,
          fps: 30,
          duration: 3,
          currentTime: 0,
          isPlaying: false,
          layers: [
            {
              id: 'layer1',
              name: 'Layer 1',
              element: {
                id: 'rect1',
                type: 'rect',
                name: 'Rect',
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 },
                style: {},
              },
              visible: false,
              locked: false,
            },
          ],
        },
      });

      useStore.getState().toggleLayerVisibility('layer1');

      expect(useStore.getState().project?.layers[0].visible).toBe(true);
    });

    it('should handle null project gracefully', () => {
      useStore.setState({ project: null });

      useStore.getState().toggleLayerVisibility('layer1');

      expect(useStore.getState().project).toBeNull();
    });
  });

  describe('toggleLayerLock', () => {
    it('should toggle layer lock from false to true', () => {
      useStore.setState({
        project: {
          name: 'Test',
          width: 800,
          height: 600,
          fps: 30,
          duration: 3,
          currentTime: 0,
          isPlaying: false,
          layers: [
            {
              id: 'layer1',
              name: 'Layer 1',
              element: {
                id: 'rect1',
                type: 'rect',
                name: 'Rect',
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 },
                style: {},
              },
              visible: true,
              locked: false,
            },
          ],
        },
      });

      useStore.getState().toggleLayerLock('layer1');

      expect(useStore.getState().project?.layers[0].locked).toBe(true);
    });

    it('should toggle layer lock from true to false', () => {
      useStore.setState({
        project: {
          name: 'Test',
          width: 800,
          height: 600,
          fps: 30,
          duration: 3,
          currentTime: 0,
          isPlaying: false,
          layers: [
            {
              id: 'layer1',
              name: 'Layer 1',
              element: {
                id: 'rect1',
                type: 'rect',
                name: 'Rect',
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 },
                style: {},
              },
              visible: true,
              locked: true,
            },
          ],
        },
      });

      useStore.getState().toggleLayerLock('layer1');

      expect(useStore.getState().project?.layers[0].locked).toBe(false);
    });

    it('should handle null project gracefully', () => {
      useStore.setState({ project: null });

      useStore.getState().toggleLayerLock('layer1');

      expect(useStore.getState().project).toBeNull();
    });
  });

  describe('selectLayer', () => {
    it('should set selected layer id', () => {
      useStore.setState({
        project: {
          name: 'Test',
          width: 800,
          height: 600,
          fps: 30,
          duration: 3,
          currentTime: 0,
          isPlaying: false,
          layers: [
            {
              id: 'layer1',
              name: 'Layer 1',
              element: {
                id: 'rect1',
                type: 'rect',
                name: 'Rect',
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 },
                style: {},
              },
              visible: true,
              locked: false,
            },
          ],
        },
      });

      useStore.getState().selectLayer('layer1');

      expect(useStore.getState().project?.selectedLayerId).toBe('layer1');
    });

    it('should update selected layer when selecting different layer', () => {
      useStore.setState({
        project: {
          name: 'Test',
          width: 800,
          height: 600,
          fps: 30,
          duration: 3,
          currentTime: 0,
          isPlaying: false,
          selectedLayerId: 'layer1',
          layers: [
            {
              id: 'layer1',
              name: 'Layer 1',
              element: {
                id: 'rect1',
                type: 'rect',
                name: 'Rect',
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 },
                style: {},
              },
              visible: true,
              locked: false,
            },
            {
              id: 'layer2',
              name: 'Layer 2',
              element: {
                id: 'circle1',
                type: 'circle',
                name: 'Circle',
                cx: 50,
                cy: 50,
                r: 25,
                transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 },
                style: {},
              },
              visible: true,
              locked: false,
            },
          ],
        },
      });

      useStore.getState().selectLayer('layer2');

      expect(useStore.getState().project?.selectedLayerId).toBe('layer2');
    });
  });

  describe('addKeyframe', () => {
    beforeEach(() => {
      useStore.setState({
        project: {
          name: 'Test',
          width: 800,
          height: 600,
          fps: 30,
          duration: 5,
          currentTime: 1,
          isPlaying: false,
          layers: [],
          keyframes: [],
        },
      });
    });

    it('should add a new keyframe', () => {
      useStore.getState().addKeyframe('layer1', 'x', 100);

      const keyframes = useStore.getState().project?.keyframes || [];
      expect(keyframes).toHaveLength(1);
      expect(keyframes[0]).toMatchObject({
        time: 1,
        property: 'x',
        value: 100,
        easing: 'linear',
      });
      expect((keyframes[0] as any).layerId).toBe('layer1');
    });

    it('should update existing keyframe at same time and property', () => {
      useStore.getState().addKeyframe('layer1', 'x', 100);
      useStore.getState().addKeyframe('layer1', 'x', 200);

      const keyframes = useStore.getState().project?.keyframes || [];
      expect(keyframes).toHaveLength(1);
      expect(keyframes[0].value).toBe(200);
    });

    it('should allow multiple keyframes for different properties', () => {
      useStore.getState().addKeyframe('layer1', 'x', 100);
      useStore.getState().addKeyframe('layer1', 'y', 200);

      const keyframes = useStore.getState().project?.keyframes || [];
      expect(keyframes).toHaveLength(2);
    });

    it('should handle null project gracefully', () => {
      useStore.setState({ project: null });
      useStore.getState().addKeyframe('layer1', 'x', 100);
      expect(useStore.getState().project).toBeNull();
    });
  });

  describe('deleteKeyframe', () => {
    beforeEach(() => {
      useStore.setState({
        project: {
          name: 'Test',
          width: 800,
          height: 600,
          fps: 30,
          duration: 5,
          currentTime: 0,
          isPlaying: false,
          layers: [],
          keyframes: [
            {
              id: 'kf-1',
              time: 0,
              property: 'x',
              value: 100,
              easing: 'linear',
            } as any,
            {
              id: 'kf-2',
              time: 1,
              property: 'y',
              value: 200,
              easing: 'linear',
            } as any,
          ],
        },
      });
    });

    it('should delete a keyframe by id', () => {
      useStore.getState().deleteKeyframe('kf-1');

      const keyframes = useStore.getState().project?.keyframes || [];
      expect(keyframes).toHaveLength(1);
      expect(keyframes[0].id).toBe('kf-2');
    });

    it('should handle deleting non-existent keyframe', () => {
      useStore.getState().deleteKeyframe('non-existent');

      const keyframes = useStore.getState().project?.keyframes || [];
      expect(keyframes).toHaveLength(2);
    });

    it('should handle null project gracefully', () => {
      useStore.setState({ project: null });
      useStore.getState().deleteKeyframe('kf-1');
      expect(useStore.getState().project).toBeNull();
    });
  });

  describe('updateKeyframe', () => {
    beforeEach(() => {
      useStore.setState({
        project: {
          name: 'Test',
          width: 800,
          height: 600,
          fps: 30,
          duration: 5,
          currentTime: 0,
          isPlaying: false,
          layers: [],
          keyframes: [
            {
              id: 'kf-1',
              time: 0,
              property: 'x',
              value: 100,
              easing: 'linear',
            } as any,
          ],
        },
      });
    });

    it('should update keyframe properties', () => {
      useStore.getState().updateKeyframe('kf-1', { value: 200, easing: 'ease-in' });

      const keyframes = useStore.getState().project?.keyframes || [];
      expect(keyframes[0]).toMatchObject({
        id: 'kf-1',
        time: 0,
        property: 'x',
        value: 200,
        easing: 'ease-in',
      });
    });

    it('should handle updating non-existent keyframe', () => {
      useStore.getState().updateKeyframe('non-existent', { value: 300 });

      const keyframes = useStore.getState().project?.keyframes || [];
      expect(keyframes).toHaveLength(1);
      expect(keyframes[0].value).toBe(100);
    });

    it('should handle null project gracefully', () => {
      useStore.setState({ project: null });
      useStore.getState().updateKeyframe('kf-1', { value: 200 });
      expect(useStore.getState().project).toBeNull();
    });
  });

  describe('getKeyframesForLayer', () => {
    beforeEach(() => {
      useStore.setState({
        project: {
          name: 'Test',
          width: 800,
          height: 600,
          fps: 30,
          duration: 5,
          currentTime: 0,
          isPlaying: false,
          layers: [],
          keyframes: [
            {
              id: 'kf-1',
              time: 0,
              property: 'x',
              value: 100,
              easing: 'linear',
              layerId: 'layer1',
            } as any,
            {
              id: 'kf-2',
              time: 1,
              property: 'y',
              value: 200,
              easing: 'linear',
              layerId: 'layer1',
            } as any,
            {
              id: 'kf-3',
              time: 0,
              property: 'x',
              value: 150,
              easing: 'linear',
              layerId: 'layer2',
            } as any,
          ],
        },
      });
    });

    it('should return all keyframes for a layer', () => {
      const keyframes = useStore.getState().getKeyframesForLayer('layer1');
      expect(keyframes).toHaveLength(2);
      expect(keyframes.map((kf) => kf.id)).toEqual(['kf-1', 'kf-2']);
    });

    it('should filter keyframes by property', () => {
      const keyframes = useStore.getState().getKeyframesForLayer('layer1', 'x');
      expect(keyframes).toHaveLength(1);
      expect(keyframes[0].property).toBe('x');
    });

    it('should return empty array for non-existent layer', () => {
      const keyframes = useStore.getState().getKeyframesForLayer('non-existent');
      expect(keyframes).toHaveLength(0);
    });

    it('should sort keyframes by time', () => {
      useStore.setState({
        project: {
          name: 'Test',
          width: 800,
          height: 600,
          fps: 30,
          duration: 5,
          currentTime: 0,
          isPlaying: false,
          layers: [],
          keyframes: [
            {
              id: 'kf-1',
              time: 2,
              property: 'x',
              value: 100,
              easing: 'linear',
              layerId: 'layer1',
            } as any,
            {
              id: 'kf-2',
              time: 0,
              property: 'x',
              value: 200,
              easing: 'linear',
              layerId: 'layer1',
            } as any,
            {
              id: 'kf-3',
              time: 1,
              property: 'x',
              value: 150,
              easing: 'linear',
              layerId: 'layer1',
            } as any,
          ],
        },
      });

      const keyframes = useStore.getState().getKeyframesForLayer('layer1');
      expect(keyframes.map((kf) => kf.time)).toEqual([0, 1, 2]);
    });

    it('should handle null project gracefully', () => {
      useStore.setState({ project: null });
      const keyframes = useStore.getState().getKeyframesForLayer('layer1');
      expect(keyframes).toHaveLength(0);
    });
  });

  describe('deleteLayer', () => {
    beforeEach(() => {
      useStore.setState({
        project: {
          name: 'Test',
          width: 800,
          height: 600,
          fps: 30,
          duration: 5,
          loop: true,
          currentTime: 0,
          isPlaying: false,
          selectedLayerId: 'layer1',
          layers: [
            {
              id: 'layer1',
              name: 'Layer 1',
              element: {
                id: 'rect1',
                type: 'rect',
                name: 'Rect',
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 },
                style: {},
              },
              visible: true,
              locked: false,
            },
            {
              id: 'layer2',
              name: 'Layer 2',
              element: {
                id: 'circle1',
                type: 'circle',
                name: 'Circle',
                cx: 50,
                cy: 50,
                r: 25,
                transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 },
                style: {},
              },
              visible: true,
              locked: false,
            },
          ],
          keyframes: [
            {
              id: 'kf-1',
              time: 0,
              property: 'x',
              value: 100,
              easing: 'linear',
              layerId: 'layer1',
            } as any,
            {
              id: 'kf-2',
              time: 1,
              property: 'y',
              value: 200,
              easing: 'linear',
              layerId: 'layer1',
            } as any,
            {
              id: 'kf-3',
              time: 0,
              property: 'x',
              value: 150,
              easing: 'linear',
              layerId: 'layer2',
            } as any,
          ],
        },
      });
    });

    it('should delete layer by id', () => {
      useStore.getState().deleteLayer('layer1');

      const layers = useStore.getState().project?.layers || [];
      expect(layers).toHaveLength(1);
      expect(layers[0].id).toBe('layer2');
    });

    it('should delete all keyframes associated with the layer', () => {
      useStore.getState().deleteLayer('layer1');

      const keyframes = useStore.getState().project?.keyframes || [];
      expect(keyframes).toHaveLength(1);
      expect((keyframes[0] as any).layerId).toBe('layer2');
    });

    it('should clear selection if deleted layer was selected', () => {
      useStore.getState().deleteLayer('layer1');

      const selectedLayerId = useStore.getState().project?.selectedLayerId;
      expect(selectedLayerId).toBeUndefined();
    });

    it('should not clear selection if deleted layer was not selected', () => {
      useStore.getState().deleteLayer('layer2');

      const selectedLayerId = useStore.getState().project?.selectedLayerId;
      expect(selectedLayerId).toBe('layer1');
    });

    it('should handle deleting non-existent layer', () => {
      useStore.getState().deleteLayer('non-existent');

      const layers = useStore.getState().project?.layers || [];
      expect(layers).toHaveLength(2);
    });

    it('should handle null project gracefully', () => {
      useStore.setState({ project: null });
      useStore.getState().deleteLayer('layer1');
      expect(useStore.getState().project).toBeNull();
    });

    it('should delete child layers when deleting a group', () => {
      // Set up a group with children
      useStore.setState({
        project: {
          name: 'Test',
          width: 800,
          height: 600,
          fps: 30,
          duration: 5,
          loop: true,
          currentTime: 0,
          isPlaying: false,
          selectedLayerId: undefined,
          layers: [
            {
              id: 'group1',
              name: 'Group 1',
              element: {
                id: 'g1',
                type: 'group',
                name: 'Group',
                transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 },
                style: {},
                children: [],
              },
              visible: true,
              locked: false,
            },
            {
              id: 'child1',
              name: 'Child 1',
              element: {
                id: 'rect1',
                type: 'rect',
                name: 'Rect',
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 },
                style: {},
              },
              visible: true,
              locked: false,
              parentId: 'group1',
            },
            {
              id: 'child2',
              name: 'Child 2',
              element: {
                id: 'circle1',
                type: 'circle',
                name: 'Circle',
                cx: 50,
                cy: 50,
                r: 25,
                transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 },
                style: {},
              },
              visible: true,
              locked: false,
              parentId: 'group1',
            },
            {
              id: 'layer2',
              name: 'Layer 2',
              element: {
                id: 'rect2',
                type: 'rect',
                name: 'Rect',
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 },
                style: {},
              },
              visible: true,
              locked: false,
            },
          ],
          keyframes: [
            {
              id: 'kf-1',
              time: 0,
              property: 'x',
              value: 100,
              easing: 'linear',
              layerId: 'child1',
            } as any,
            {
              id: 'kf-2',
              time: 1,
              property: 'y',
              value: 200,
              easing: 'linear',
              layerId: 'child2',
            } as any,
            {
              id: 'kf-3',
              time: 0,
              property: 'x',
              value: 150,
              easing: 'linear',
              layerId: 'layer2',
            } as any,
          ],
        },
      });

      // Delete the group
      useStore.getState().deleteLayer('group1');

      const layers = useStore.getState().project?.layers || [];
      const keyframes = useStore.getState().project?.keyframes || [];

      // Should only have layer2 remaining
      expect(layers).toHaveLength(1);
      expect(layers[0].id).toBe('layer2');

      // Should only have keyframe for layer2
      expect(keyframes).toHaveLength(1);
      expect((keyframes[0] as any).layerId).toBe('layer2');
    });
  });

  describe('toggleLayerSelection', () => {
    beforeEach(() => {
      useStore.setState({
        project: {
          name: 'Test',
          width: 800,
          height: 600,
          fps: 30,
          duration: 5,
          loop: true,
          currentTime: 0,
          isPlaying: false,
          selectedLayerId: undefined,
          selectedLayerIds: [],
          layers: [
            {
              id: 'layer1',
              name: 'Layer 1',
              element: {
                id: 'rect1',
                type: 'rect',
                name: 'Rect',
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 },
                style: {},
              },
              visible: true,
              locked: false,
            },
            {
              id: 'layer2',
              name: 'Layer 2',
              element: {
                id: 'circle1',
                type: 'circle',
                name: 'Circle',
                cx: 50,
                cy: 50,
                r: 25,
                transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 },
                style: {},
              },
              visible: true,
              locked: false,
            },
            {
              id: 'layer3',
              name: 'Layer 3',
              element: {
                id: 'rect2',
                type: 'rect',
                name: 'Rect',
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 },
                style: {},
              },
              visible: true,
              locked: false,
            },
          ],
          keyframes: [],
        },
      });
    });

    it('should add layer to selection when not selected', () => {
      useStore.getState().toggleLayerSelection('layer1');

      const selectedLayerIds = useStore.getState().project?.selectedLayerIds || [];
      expect(selectedLayerIds).toEqual(['layer1']);
      expect(useStore.getState().project?.selectedLayerId).toBe('layer1');
    });

    it('should remove layer from selection when already selected', () => {
      useStore.setState({
        project: {
          ...useStore.getState().project!,
          selectedLayerIds: ['layer1', 'layer2'],
          selectedLayerId: undefined,
        },
      });

      useStore.getState().toggleLayerSelection('layer1');

      const selectedLayerIds = useStore.getState().project?.selectedLayerIds || [];
      expect(selectedLayerIds).toEqual(['layer2']);
      expect(useStore.getState().project?.selectedLayerId).toBe('layer2');
    });

    it('should add multiple layers to selection', () => {
      useStore.getState().toggleLayerSelection('layer1');
      useStore.getState().toggleLayerSelection('layer2');
      useStore.getState().toggleLayerSelection('layer3');

      const selectedLayerIds = useStore.getState().project?.selectedLayerIds || [];
      expect(selectedLayerIds).toEqual(['layer1', 'layer2', 'layer3']);
      expect(useStore.getState().project?.selectedLayerId).toBeUndefined();
    });

    it('should set selectedLayerId to undefined when multiple layers selected', () => {
      useStore.getState().toggleLayerSelection('layer1');
      useStore.getState().toggleLayerSelection('layer2');

      expect(useStore.getState().project?.selectedLayerId).toBeUndefined();
    });

    it('should handle null project gracefully', () => {
      useStore.setState({ project: null });
      useStore.getState().toggleLayerSelection('layer1');
      expect(useStore.getState().project).toBeNull();
    });
  });

  describe('setSelectedLayerIds', () => {
    beforeEach(() => {
      useStore.setState({
        project: {
          name: 'Test',
          width: 800,
          height: 600,
          fps: 30,
          duration: 5,
          loop: true,
          currentTime: 0,
          isPlaying: false,
          selectedLayerId: undefined,
          selectedLayerIds: [],
          layers: [
            {
              id: 'layer1',
              name: 'Layer 1',
              element: {
                id: 'rect1',
                type: 'rect',
                name: 'Rect',
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 },
                style: {},
              },
              visible: true,
              locked: false,
            },
            {
              id: 'layer2',
              name: 'Layer 2',
              element: {
                id: 'circle1',
                type: 'circle',
                name: 'Circle',
                cx: 50,
                cy: 50,
                r: 25,
                transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 },
                style: {},
              },
              visible: true,
              locked: false,
            },
          ],
          keyframes: [],
        },
      });
    });

    it('should set multiple selected layer ids', () => {
      useStore.getState().setSelectedLayerIds(['layer1', 'layer2']);

      const selectedLayerIds = useStore.getState().project?.selectedLayerIds || [];
      expect(selectedLayerIds).toEqual(['layer1', 'layer2']);
      expect(useStore.getState().project?.selectedLayerId).toBeUndefined();
    });

    it('should set selectedLayerId when only one layer selected', () => {
      useStore.getState().setSelectedLayerIds(['layer1']);

      expect(useStore.getState().project?.selectedLayerId).toBe('layer1');
      expect(useStore.getState().project?.selectedLayerIds).toEqual(['layer1']);
    });

    it('should clear selection when empty array provided', () => {
      useStore.setState({
        project: {
          ...useStore.getState().project!,
          selectedLayerIds: ['layer1', 'layer2'],
        },
      });

      useStore.getState().setSelectedLayerIds([]);

      expect(useStore.getState().project?.selectedLayerIds).toEqual([]);
      expect(useStore.getState().project?.selectedLayerId).toBeUndefined();
    });

    it('should handle null project gracefully', () => {
      useStore.setState({ project: null });
      useStore.getState().setSelectedLayerIds(['layer1']);
      expect(useStore.getState().project).toBeNull();
    });
  });

  describe('deleteLayers', () => {
    beforeEach(() => {
      useStore.setState({
        project: {
          name: 'Test',
          width: 800,
          height: 600,
          fps: 30,
          duration: 5,
          loop: true,
          currentTime: 0,
          isPlaying: false,
          selectedLayerId: undefined,
          selectedLayerIds: ['layer1', 'layer2'],
          layers: [
            {
              id: 'layer1',
              name: 'Layer 1',
              element: {
                id: 'rect1',
                type: 'rect',
                name: 'Rect',
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 },
                style: {},
              },
              visible: true,
              locked: false,
            },
            {
              id: 'layer2',
              name: 'Layer 2',
              element: {
                id: 'circle1',
                type: 'circle',
                name: 'Circle',
                cx: 50,
                cy: 50,
                r: 25,
                transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 },
                style: {},
              },
              visible: true,
              locked: false,
            },
            {
              id: 'layer3',
              name: 'Layer 3',
              element: {
                id: 'rect2',
                type: 'rect',
                name: 'Rect',
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 },
                style: {},
              },
              visible: true,
              locked: false,
            },
          ],
          keyframes: [
            {
              id: 'kf-1',
              time: 0,
              property: 'x',
              value: 100,
              easing: 'linear',
              layerId: 'layer1',
            } as any,
            {
              id: 'kf-2',
              time: 1,
              property: 'y',
              value: 200,
              easing: 'linear',
              layerId: 'layer2',
            } as any,
            {
              id: 'kf-3',
              time: 0,
              property: 'x',
              value: 150,
              easing: 'linear',
              layerId: 'layer3',
            } as any,
          ],
        },
      });
    });

    it('should delete multiple layers', () => {
      useStore.getState().deleteLayers(['layer1', 'layer2']);

      const layers = useStore.getState().project?.layers || [];
      expect(layers).toHaveLength(1);
      expect(layers[0].id).toBe('layer3');
    });

    it('should delete keyframes for all deleted layers', () => {
      useStore.getState().deleteLayers(['layer1', 'layer2']);

      const keyframes = useStore.getState().project?.keyframes || [];
      expect(keyframes).toHaveLength(1);
      expect((keyframes[0] as any).layerId).toBe('layer3');
    });

    it('should clear selection if deleted layers were selected', () => {
      useStore.getState().deleteLayers(['layer1', 'layer2']);

      expect(useStore.getState().project?.selectedLayerIds).toEqual([]);
      expect(useStore.getState().project?.selectedLayerId).toBeUndefined();
    });

    it('should partially clear selection if some deleted layers were selected', () => {
      useStore.setState({
        project: {
          ...useStore.getState().project!,
          selectedLayerIds: ['layer1', 'layer2', 'layer3'],
        },
      });

      useStore.getState().deleteLayers(['layer1']);

      const selectedLayerIds = useStore.getState().project?.selectedLayerIds || [];
      expect(selectedLayerIds).toEqual(['layer2', 'layer3']);
    });

    it('should delete child layers when deleting group layers', () => {
      useStore.setState({
        project: {
          name: 'Test',
          width: 800,
          height: 600,
          fps: 30,
          duration: 5,
          loop: true,
          currentTime: 0,
          isPlaying: false,
          selectedLayerId: undefined,
          selectedLayerIds: [],
          layers: [
            {
              id: 'group1',
              name: 'Group 1',
              element: {
                id: 'g1',
                type: 'group',
                name: 'Group',
                transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 },
                style: {},
                children: [],
              },
              visible: true,
              locked: false,
            },
            {
              id: 'child1',
              name: 'Child 1',
              element: {
                id: 'rect1',
                type: 'rect',
                name: 'Rect',
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 },
                style: {},
              },
              visible: true,
              locked: false,
              parentId: 'group1',
            },
            {
              id: 'group2',
              name: 'Group 2',
              element: {
                id: 'g2',
                type: 'group',
                name: 'Group',
                transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 },
                style: {},
                children: [],
              },
              visible: true,
              locked: false,
            },
            {
              id: 'child2',
              name: 'Child 2',
              element: {
                id: 'rect2',
                type: 'rect',
                name: 'Rect',
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 },
                style: {},
              },
              visible: true,
              locked: false,
              parentId: 'group2',
            },
            {
              id: 'layer1',
              name: 'Layer 1',
              element: {
                id: 'rect3',
                type: 'rect',
                name: 'Rect',
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 },
                style: {},
              },
              visible: true,
              locked: false,
            },
          ],
          keyframes: [],
        },
      });

      useStore.getState().deleteLayers(['group1', 'group2']);

      const layers = useStore.getState().project?.layers || [];
      // Should only have layer1 remaining (group1, child1, group2, and child2 should be deleted)
      expect(layers).toHaveLength(1);
      expect(layers[0].id).toBe('layer1');
    });

    it('should handle deleting non-existent layers', () => {
      useStore.getState().deleteLayers(['non-existent1', 'non-existent2']);

      const layers = useStore.getState().project?.layers || [];
      expect(layers).toHaveLength(3);
    });

    it('should handle empty array', () => {
      useStore.getState().deleteLayers([]);

      const layers = useStore.getState().project?.layers || [];
      expect(layers).toHaveLength(3);
    });

    it('should handle null project gracefully', () => {
      useStore.setState({ project: null });
      useStore.getState().deleteLayers(['layer1', 'layer2']);
      expect(useStore.getState().project).toBeNull();
    });
  });
});
