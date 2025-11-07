import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import lottie from 'lottie-web';
import { LottieExporter } from './LottieExporter';
import type { Project } from '../models/Project';
import type { Layer } from '../models/Layer';
import type { RectElement } from '../models/Element';

/**
 * Integration tests to verify exported Lottie JSON works with lottie-web
 * This is critical to ensure our export format is compatible with the Lottie player
 */
describe('LottieExporter - lottie-web integration', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    // Create a container element for lottie-web to render into
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    // Cleanup
    if (container && container.parentNode) {
      document.body.removeChild(container);
    }
    lottie.destroy();
  });

  it('should export JSON that loads successfully in lottie-web', () => {
    const rectElement: RectElement = {
      type: 'rect',
      x: 100,
      y: 100,
      width: 200,
      height: 150,
      transform: {
        x: 100,
        y: 100,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
      },
      style: {
        fill: '#ff0000',
        stroke: 'none',
        strokeWidth: 1,
        opacity: 1,
      },
    };

    const layer: Layer = {
      id: 'layer1',
      name: 'Rectangle Layer',
      element: rectElement,
      visible: true,
      locked: false,
    };

    const project: Project = {
      name: 'Integration Test',
      width: 800,
      height: 600,
      fps: 30,
      duration: 2,
      currentTime: 0,
      isPlaying: false,
      layers: [layer],
      keyframes: [],
    };

    // Export to Lottie format
    const lottieJson = LottieExporter.exportToLottie(project);

    // Should not throw error when loading
    expect(() => {
      lottie.loadAnimation({
        container: container,
        renderer: 'svg',
        loop: true,
        autoplay: false,
        animationData: lottieJson,
      });
    }).not.toThrow();
  });

  it('should export animated JSON that plays in lottie-web', () => {
    const rectElement: RectElement = {
      type: 'rect',
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      transform: {
        x: 100,
        y: 100,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
      },
      style: {
        fill: '#00ff00',
        stroke: 'none',
        strokeWidth: 1,
        opacity: 1,
      },
    };

    const layer: Layer = {
      id: 'layer1',
      name: 'Animated Rectangle',
      element: rectElement,
      visible: true,
      locked: false,
    };

    const project: Project = {
      name: 'Animated Test',
      width: 800,
      height: 600,
      fps: 30,
      duration: 2,
      currentTime: 0,
      isPlaying: false,
      layers: [layer],
      keyframes: [
        {
          id: 'kf1',
          time: 0,
          property: 'x',
          value: 100,
          easing: 'ease-in-out',
          layerId: 'layer1',
        } as any,
        {
          id: 'kf2',
          time: 1,
          property: 'x',
          value: 400,
          easing: 'ease-in-out',
          layerId: 'layer1',
        } as any,
        {
          id: 'kf3',
          time: 0,
          property: 'rotation',
          value: 0,
          easing: 'linear',
          layerId: 'layer1',
        } as any,
        {
          id: 'kf4',
          time: 2,
          property: 'rotation',
          value: 360,
          easing: 'linear',
          layerId: 'layer1',
        } as any,
      ],
    };

    // Export to Lottie format
    const lottieJson = LottieExporter.exportToLottie(project);

    // Load animation
    const animation = lottie.loadAnimation({
      container: container,
      renderer: 'svg',
      loop: true,
      autoplay: false,
      animationData: lottieJson,
    });

    // Verify animation loaded successfully
    expect(animation).toBeDefined();
    expect(animation.totalFrames).toBe(60); // 2 seconds * 30 fps
    expect(animation.frameRate).toBe(30);

    // Test that animation can be controlled
    expect(() => {
      animation.goToAndStop(0, true);
      animation.goToAndStop(30, true);
      animation.goToAndStop(60, true);
    }).not.toThrow();
  });

  it('should export multi-property animation that renders correctly', () => {
    const rectElement: RectElement = {
      type: 'rect',
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      transform: {
        x: 100,
        y: 100,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
      },
      style: {
        fill: '#0000ff',
        stroke: 'none',
        strokeWidth: 1,
        opacity: 1,
      },
    };

    const layer: Layer = {
      id: 'layer1',
      name: 'Multi-prop Rectangle',
      element: rectElement,
      visible: true,
      locked: false,
    };

    const project: Project = {
      name: 'Multi-prop Test',
      width: 800,
      height: 600,
      fps: 30,
      duration: 1.5,
      currentTime: 0,
      isPlaying: false,
      layers: [layer],
      keyframes: [
        // Position animation
        { id: 'kf1', time: 0, property: 'x', value: 100, easing: 'ease-out', layerId: 'layer1' } as any,
        { id: 'kf2', time: 1.5, property: 'x', value: 500, easing: 'ease-out', layerId: 'layer1' } as any,
        { id: 'kf3', time: 0, property: 'y', value: 100, easing: 'ease-in', layerId: 'layer1' } as any,
        { id: 'kf4', time: 1.5, property: 'y', value: 400, easing: 'ease-in', layerId: 'layer1' } as any,
        // Rotation animation
        { id: 'kf5', time: 0, property: 'rotation', value: 0, easing: 'linear', layerId: 'layer1' } as any,
        { id: 'kf6', time: 1.5, property: 'rotation', value: 180, easing: 'linear', layerId: 'layer1' } as any,
        // Scale animation
        { id: 'kf7', time: 0, property: 'scaleX', value: 1, easing: 'ease-in-out', layerId: 'layer1' } as any,
        { id: 'kf8', time: 1.5, property: 'scaleX', value: 2, easing: 'ease-in-out', layerId: 'layer1' } as any,
        { id: 'kf9', time: 0, property: 'scaleY', value: 1, easing: 'ease-in-out', layerId: 'layer1' } as any,
        { id: 'kf10', time: 1.5, property: 'scaleY', value: 2, easing: 'ease-in-out', layerId: 'layer1' } as any,
        // Opacity animation
        { id: 'kf11', time: 0, property: 'opacity', value: 1, easing: 'linear', layerId: 'layer1' } as any,
        { id: 'kf12', time: 1.5, property: 'opacity', value: 0.3, easing: 'linear', layerId: 'layer1' } as any,
      ],
    };

    // Export to Lottie format
    const lottieJson = LottieExporter.exportToLottie(project);

    // Load animation
    const animation = lottie.loadAnimation({
      container: container,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: lottieJson,
    });

    // Verify animation loaded
    expect(animation).toBeDefined();
    expect(animation.totalFrames).toBe(45); // 1.5 seconds * 30 fps

    // Test seeking through animation
    animation.goToAndStop(0, true);
    expect(container.querySelector('svg')).toBeTruthy();

    animation.goToAndStop(22, true); // Middle frame
    expect(container.querySelector('svg')).toBeTruthy();

    animation.goToAndStop(45, true); // Last frame
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('should export multi-layer animation that renders all layers', () => {
    const rect1: RectElement = {
      type: 'rect',
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      transform: { x: 100, y: 100, rotation: 0, scaleX: 1, scaleY: 1 },
      style: { fill: '#ff0000', stroke: 'none', strokeWidth: 1, opacity: 1 },
    };

    const rect2: RectElement = {
      type: 'rect',
      x: 0,
      y: 0,
      width: 150,
      height: 150,
      transform: { x: 300, y: 300, rotation: 45, scaleX: 1, scaleY: 1 },
      style: { fill: '#00ff00', stroke: 'none', strokeWidth: 1, opacity: 0.7 },
    };

    const layer1: Layer = {
      id: 'layer1',
      name: 'Layer 1',
      element: rect1,
      visible: true,
      locked: false,
    };

    const layer2: Layer = {
      id: 'layer2',
      name: 'Layer 2',
      element: rect2,
      visible: true,
      locked: false,
    };

    const project: Project = {
      name: 'Multi-layer Test',
      width: 800,
      height: 600,
      fps: 30,
      duration: 1,
      currentTime: 0,
      isPlaying: false,
      layers: [layer1, layer2],
      keyframes: [],
    };

    // Export to Lottie format
    const lottieJson = LottieExporter.exportToLottie(project);

    // Verify structure
    expect(lottieJson.layers).toHaveLength(2);

    // Load animation
    const animation = lottie.loadAnimation({
      container: container,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: lottieJson,
    });

    // Verify animation loaded and rendered
    expect(animation).toBeDefined();
    animation.goToAndStop(0, true);

    // Should have SVG element
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('should handle console errors during animation load', () => {
    // Spy on console.error to catch any lottie-web errors
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const rectElement: RectElement = {
      type: 'rect',
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      transform: { x: 100, y: 100, rotation: 0, scaleX: 1, scaleY: 1 },
      style: { fill: '#ff0000', stroke: 'none', strokeWidth: 1, opacity: 1 },
    };

    const layer: Layer = {
      id: 'layer1',
      name: 'Test Layer',
      element: rectElement,
      visible: true,
      locked: false,
    };

    const project: Project = {
      name: 'Error Test',
      width: 800,
      height: 600,
      fps: 30,
      duration: 1,
      currentTime: 0,
      isPlaying: false,
      layers: [layer],
      keyframes: [],
    };

    const lottieJson = LottieExporter.exportToLottie(project);

    lottie.loadAnimation({
      container: container,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: lottieJson,
    });

    // Should not have any console errors
    expect(consoleErrorSpy).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});
