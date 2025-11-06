import { describe, it, expect } from 'vitest';
import {
  interpolateLinear,
  interpolateKeyframes,
  getValueAtTime,
  findKeyframeBounds,
} from './Interpolation';
import type { Keyframe } from '../models/Keyframe';

describe('Interpolation Engine', () => {
  describe('interpolateLinear', () => {
    it('should interpolate between two numbers', () => {
      expect(interpolateLinear(0, 100, 0)).toBe(0);
      expect(interpolateLinear(0, 100, 0.5)).toBe(50);
      expect(interpolateLinear(0, 100, 1)).toBe(100);
    });

    it('should handle negative numbers', () => {
      expect(interpolateLinear(-50, 50, 0.5)).toBe(0);
      expect(interpolateLinear(-100, -50, 0.5)).toBe(-75);
    });

    it('should clamp t to 0-1 range', () => {
      expect(interpolateLinear(0, 100, -0.5)).toBe(0);
      expect(interpolateLinear(0, 100, 1.5)).toBe(100);
    });

    it('should work with decimal values', () => {
      expect(interpolateLinear(0, 1, 0.333)).toBeCloseTo(0.333, 3);
      expect(interpolateLinear(10.5, 20.7, 0.5)).toBeCloseTo(15.6, 3);
    });
  });

  describe('findKeyframeBounds', () => {
    const keyframes: Keyframe[] = [
      { id: '1', time: 0, property: 'x', value: 0, easing: 'linear' },
      { id: '2', time: 1, property: 'x', value: 100, easing: 'linear' },
      { id: '3', time: 2, property: 'x', value: 50, easing: 'linear' },
      { id: '4', time: 3, property: 'x', value: 200, easing: 'linear' },
    ];

    it('should find keyframes before and after given time', () => {
      const result = findKeyframeBounds(keyframes, 1.5);
      expect(result?.before.time).toBe(1);
      expect(result?.after.time).toBe(2);
    });

    it('should return null if time is before first keyframe', () => {
      const result = findKeyframeBounds(keyframes, -1);
      expect(result).toBeNull();
    });

    it('should return null if time is after last keyframe', () => {
      const result = findKeyframeBounds(keyframes, 4);
      expect(result).toBeNull();
    });

    it('should handle exact keyframe time', () => {
      const result = findKeyframeBounds(keyframes, 1);
      expect(result?.before.time).toBe(1);
      expect(result?.after.time).toBe(2);
    });

    it('should handle time between first two keyframes', () => {
      const result = findKeyframeBounds(keyframes, 0.5);
      expect(result?.before.time).toBe(0);
      expect(result?.after.time).toBe(1);
    });

    it('should return null for empty keyframes array', () => {
      const result = findKeyframeBounds([], 1);
      expect(result).toBeNull();
    });

    it('should return null for single keyframe', () => {
      const result = findKeyframeBounds([keyframes[0]], 1);
      expect(result).toBeNull();
    });
  });

  describe('interpolateKeyframes', () => {
    it('should interpolate between two keyframes with linear easing', () => {
      const keyframe1: Keyframe = {
        id: '1',
        time: 0,
        property: 'x',
        value: 0,
        easing: 'linear',
      };
      const keyframe2: Keyframe = {
        id: '2',
        time: 2,
        property: 'x',
        value: 100,
        easing: 'linear',
      };

      expect(interpolateKeyframes(keyframe1, keyframe2, 0)).toBe(0);
      expect(interpolateKeyframes(keyframe1, keyframe2, 1)).toBe(50);
      expect(interpolateKeyframes(keyframe1, keyframe2, 2)).toBe(100);
    });

    it('should handle non-zero start time', () => {
      const keyframe1: Keyframe = {
        id: '1',
        time: 1,
        property: 'x',
        value: 50,
        easing: 'linear',
      };
      const keyframe2: Keyframe = {
        id: '2',
        time: 3,
        property: 'x',
        value: 150,
        easing: 'linear',
      };

      expect(interpolateKeyframes(keyframe1, keyframe2, 2)).toBe(100);
    });

    it('should handle negative values', () => {
      const keyframe1: Keyframe = {
        id: '1',
        time: 0,
        property: 'y',
        value: -100,
        easing: 'linear',
      };
      const keyframe2: Keyframe = {
        id: '2',
        time: 2,
        property: 'y',
        value: 100,
        easing: 'linear',
      };

      expect(interpolateKeyframes(keyframe1, keyframe2, 1)).toBe(0);
    });

    it('should return start value when time equals start time', () => {
      const keyframe1: Keyframe = {
        id: '1',
        time: 1,
        property: 'x',
        value: 50,
        easing: 'linear',
      };
      const keyframe2: Keyframe = {
        id: '2',
        time: 3,
        property: 'x',
        value: 150,
        easing: 'linear',
      };

      expect(interpolateKeyframes(keyframe1, keyframe2, 1)).toBe(50);
    });

    it('should return end value when time equals end time', () => {
      const keyframe1: Keyframe = {
        id: '1',
        time: 1,
        property: 'x',
        value: 50,
        easing: 'linear',
      };
      const keyframe2: Keyframe = {
        id: '2',
        time: 3,
        property: 'x',
        value: 150,
        easing: 'linear',
      };

      expect(interpolateKeyframes(keyframe1, keyframe2, 3)).toBe(150);
    });
  });

  describe('getValueAtTime', () => {
    it('should return interpolated value for time between keyframes', () => {
      const keyframes: Keyframe[] = [
        { id: '1', time: 0, property: 'x', value: 0, easing: 'linear' },
        { id: '2', time: 2, property: 'x', value: 100, easing: 'linear' },
      ];

      expect(getValueAtTime(keyframes, 1)).toBe(50);
    });

    it('should return first keyframe value if time is before first keyframe', () => {
      const keyframes: Keyframe[] = [
        { id: '1', time: 1, property: 'x', value: 50, easing: 'linear' },
        { id: '2', time: 2, property: 'x', value: 100, easing: 'linear' },
      ];

      expect(getValueAtTime(keyframes, 0)).toBe(50);
    });

    it('should return last keyframe value if time is after last keyframe', () => {
      const keyframes: Keyframe[] = [
        { id: '1', time: 0, property: 'x', value: 0, easing: 'linear' },
        { id: '2', time: 2, property: 'x', value: 100, easing: 'linear' },
      ];

      expect(getValueAtTime(keyframes, 3)).toBe(100);
    });

    it('should return exact keyframe value when time matches keyframe', () => {
      const keyframes: Keyframe[] = [
        { id: '1', time: 0, property: 'x', value: 0, easing: 'linear' },
        { id: '2', time: 1, property: 'x', value: 50, easing: 'linear' },
        { id: '3', time: 2, property: 'x', value: 100, easing: 'linear' },
      ];

      expect(getValueAtTime(keyframes, 1)).toBe(50);
    });

    it('should handle multiple keyframes correctly', () => {
      const keyframes: Keyframe[] = [
        { id: '1', time: 0, property: 'x', value: 0, easing: 'linear' },
        { id: '2', time: 1, property: 'x', value: 100, easing: 'linear' },
        { id: '3', time: 2, property: 'x', value: 50, easing: 'linear' },
        { id: '4', time: 3, property: 'x', value: 200, easing: 'linear' },
      ];

      expect(getValueAtTime(keyframes, 0.5)).toBe(50); // Between 0 and 1
      expect(getValueAtTime(keyframes, 1.5)).toBe(75); // Between 1 and 2
      expect(getValueAtTime(keyframes, 2.5)).toBe(125); // Between 2 and 3
    });

    it('should return 0 for empty keyframes array', () => {
      expect(getValueAtTime([], 1)).toBe(0);
    });

    it('should return the only keyframe value for single keyframe', () => {
      const keyframes: Keyframe[] = [
        { id: '1', time: 1, property: 'x', value: 42, easing: 'linear' },
      ];

      expect(getValueAtTime(keyframes, 0)).toBe(42);
      expect(getValueAtTime(keyframes, 1)).toBe(42);
      expect(getValueAtTime(keyframes, 2)).toBe(42);
    });
  });
});
