import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Canvas } from './Canvas';
import { useStore } from '../store/useStore';

describe('Canvas', () => {
  beforeEach(() => {
    useStore.setState({
      project: {
        name: 'Test Project',
        width: 800,
        height: 600,
        fps: 30,
        duration: 5,
        currentTime: 0,
        isPlaying: false,
      },
    });
  });

  it('should render canvas element', () => {
    const { container } = render(<Canvas />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('should set canvas dimensions from project settings', () => {
    const { container } = render(<Canvas />);
    const canvas = container.querySelector('canvas');

    expect(canvas).toHaveAttribute('width', '800');
    expect(canvas).toHaveAttribute('height', '600');
  });

  it('should display canvas info with dimensions and fps', () => {
    render(<Canvas />);
    expect(screen.getByText('800 × 600px @ 30fps')).toBeInTheDocument();
  });

  it('should update dimensions when project changes', () => {
    const { container, rerender } = render(<Canvas />);

    useStore.getState().updateProjectSettings({
      width: 1920,
      height: 1080,
      fps: 60,
    });

    // Force re-render to pick up store changes
    rerender(<Canvas />);

    const canvas = container.querySelector('canvas');
    expect(canvas).toHaveAttribute('width', '1920');
    expect(canvas).toHaveAttribute('height', '1080');
  });

  it('should use default dimensions when project is null', () => {
    useStore.setState({ project: null });
    const { container } = render(<Canvas />);
    const canvas = container.querySelector('canvas');

    expect(canvas).toHaveAttribute('width', '800');
    expect(canvas).toHaveAttribute('height', '600');
  });

  it('should have correct CSS classes', () => {
    const { container } = render(<Canvas />);
    expect(container.querySelector('.canvas-container')).toBeInTheDocument();
    expect(container.querySelector('.canvas-wrapper')).toBeInTheDocument();
    expect(container.querySelector('.canvas')).toBeInTheDocument();
  });
});
