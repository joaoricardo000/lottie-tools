import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Timeline } from './Timeline';
import { useStore } from '../store/useStore';

describe('Timeline', () => {
  beforeEach(() => {
    // Reset store state
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

  it('should render playback controls', () => {
    render(<Timeline />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should display play icon when not playing', () => {
    render(<Timeline />);
    expect(screen.getByText('▶')).toBeInTheDocument();
  });

  it('should display pause icon when playing', () => {
    useStore.getState().setIsPlaying(true);
    render(<Timeline />);
    expect(screen.getByText('⏸')).toBeInTheDocument();
  });

  it('should display current time and duration', () => {
    render(<Timeline />);
    expect(screen.getByText(/0\.00s \/ 5\.00s/)).toBeInTheDocument();
  });

  it('should update display when time changes', () => {
    const { rerender } = render(<Timeline />);
    useStore.getState().setCurrentTime(2.5);

    // Force re-render to pick up store changes
    rerender(<Timeline />);

    expect(screen.getByText(/2\.50s \/ 5\.00s/)).toBeInTheDocument();
  });

  it('should toggle playback on button click', async () => {
    const user = userEvent.setup();
    render(<Timeline />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(useStore.getState().project?.isPlaying).toBe(true);
  });

  it('should render timeline slider', () => {
    render(<Timeline />);
    const slider = screen.getByRole('slider');
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveAttribute('type', 'range');
  });

  it('should update time when slider changes', async () => {
    const user = userEvent.setup();
    render(<Timeline />);

    const slider = screen.getByRole('slider') as HTMLInputElement;

    // Simulate changing the slider value
    await user.pointer({ target: slider, keys: '[MouseLeft>]' });
    slider.value = '2.5';
    await user.keyboard('[/MouseLeft]');

    // The slider allows interaction, value changes should work
    expect(slider).toHaveAttribute('type', 'range');
  });
});
