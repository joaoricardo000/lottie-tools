import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PropertyEditor } from './PropertyEditor';
import { useStore } from '../store/useStore';
import type { Layer } from '../models/Layer';
import type { RectElement } from '../models/Element';

describe('PropertyEditor', () => {
  const mockLayer: Layer = {
    id: 'layer-1',
    name: 'Test Layer',
    visible: true,
    locked: false,
    element: {
      id: 'elem-1',
      type: 'rect',
      name: 'Rectangle',
      transform: {
        x: 100,
        y: 200,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
      },
      style: {
        fill: '#ff0000',
      },
      x: 0,
      y: 0,
      width: 100,
      height: 50,
    } as RectElement,
  };

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
        layers: [mockLayer],
        selectedLayerId: 'layer-1',
        keyframes: [],
      },
    });
  });

  it('should render property editor when layer is selected', () => {
    render(<PropertyEditor />);
    expect(screen.getByText(/properties/i)).toBeInTheDocument();
  });

  it('should display layer name', () => {
    render(<PropertyEditor />);
    expect(screen.getByText('Test Layer')).toBeInTheDocument();
  });

  it('should display position properties', () => {
    render(<PropertyEditor />);
    expect(screen.getByLabelText(/position x/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/position y/i)).toBeInTheDocument();
  });

  it('should show current position values', () => {
    render(<PropertyEditor />);
    const xInput = screen.getByLabelText(/position x/i) as HTMLInputElement;
    const yInput = screen.getByLabelText(/position y/i) as HTMLInputElement;

    expect(xInput.value).toBe('100');
    expect(yInput.value).toBe('200');
  });

  it('should show message when no layer is selected', () => {
    useStore.setState({
      project: {
        name: 'Test',
        width: 800,
        height: 600,
        fps: 30,
        duration: 5,
        currentTime: 0,
        isPlaying: false,
        layers: [mockLayer],
        selectedLayerId: undefined,
        keyframes: [],
      },
    });

    render(<PropertyEditor />);
    expect(screen.getByText(/no layer selected/i)).toBeInTheDocument();
  });

  it('should have keyframe button for each property', () => {
    render(<PropertyEditor />);
    const keyframeButtons = screen.getAllByRole('button', { name: /add keyframe/i });
    expect(keyframeButtons.length).toBeGreaterThanOrEqual(2); // At least for x and y
  });

  it('should add keyframe when keyframe button is clicked', async () => {
    const user = userEvent.setup();
    render(<PropertyEditor />);

    const buttons = screen.getAllByRole('button', { name: /add keyframe.*x/i });
    await user.click(buttons[0]);

    const state = useStore.getState();
    expect(state.project?.keyframes.length).toBe(1);
    expect(state.project?.keyframes[0].property).toBe('x');
    expect(state.project?.keyframes[0].value).toBe(100);
  });

  it('should update position when input value changes', async () => {
    const user = userEvent.setup();
    render(<PropertyEditor />);

    const xInput = screen.getByLabelText(/position x/i);
    await user.clear(xInput);
    await user.type(xInput, '250');

    // Value should be updated in the element transform
    const state = useStore.getState();
    const layer = state.project?.layers.find(l => l.id === 'layer-1');
    expect(layer?.element.transform.x).toBe(250);
  });

  it('should show keyframe indicator when keyframe exists at current time', () => {
    useStore.setState({
      project: {
        name: 'Test',
        width: 800,
        height: 600,
        fps: 30,
        duration: 5,
        currentTime: 1,
        isPlaying: false,
        layers: [mockLayer],
        selectedLayerId: 'layer-1',
        keyframes: [
          {
            id: 'kf-1',
            time: 1,
            property: 'x',
            value: 100,
            easing: 'linear',
            layerId: 'layer-1',
          } as any,
        ],
      },
    });

    render(<PropertyEditor />);
    // Should show some indicator that a keyframe exists (e.g., different button style)
    const buttons = screen.getAllByRole('button', { name: /keyframe.*x/i });
    expect(buttons[0]).toHaveAttribute('data-has-keyframe', 'true');
  });

  it('should display interpolated values at non-keyframe times', () => {
    useStore.setState({
      project: {
        name: 'Test',
        width: 800,
        height: 600,
        fps: 30,
        duration: 5,
        currentTime: 1,
        isPlaying: false,
        layers: [mockLayer],
        selectedLayerId: 'layer-1',
        keyframes: [
          {
            id: 'kf-1',
            time: 0,
            property: 'x',
            value: 0,
            easing: 'linear',
            layerId: 'layer-1',
          } as any,
          {
            id: 'kf-2',
            time: 2,
            property: 'x',
            value: 200,
            easing: 'linear',
            layerId: 'layer-1',
          } as any,
        ],
      },
    });

    render(<PropertyEditor />);
    const xInput = screen.getByLabelText(/position x/i) as HTMLInputElement;
    // At time=1, halfway between 0 and 2, x should be 100
    expect(Number(xInput.value)).toBeCloseTo(100, 0);
  });
});
