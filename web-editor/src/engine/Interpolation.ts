import type { Keyframe } from '../models/Keyframe';

/**
 * Linear interpolation between two values
 * @param start - Starting value
 * @param end - Ending value
 * @param t - Interpolation factor (0-1), clamped automatically
 * @returns Interpolated value
 */
export function interpolateLinear(start: number, end: number, t: number): number {
  // Clamp t to 0-1 range
  const clampedT = Math.max(0, Math.min(1, t));
  return start + (end - start) * clampedT;
}

/**
 * Find the keyframes before and after a given time
 * @param keyframes - Array of keyframes (must be sorted by time)
 * @param time - Time to find bounds for
 * @returns Object with before and after keyframes, or null if not found
 */
export function findKeyframeBounds(
  keyframes: Keyframe[],
  time: number
): { before: Keyframe; after: Keyframe } | null {
  // Handle edge cases
  if (keyframes.length === 0 || keyframes.length === 1) {
    return null;
  }

  // If time is before first keyframe or after last keyframe
  if (time < keyframes[0].time || time > keyframes[keyframes.length - 1].time) {
    return null;
  }

  // Find the surrounding keyframes
  for (let i = 0; i < keyframes.length - 1; i++) {
    const currentKeyframe = keyframes[i];
    const nextKeyframe = keyframes[i + 1];

    // If time exactly matches a keyframe, use it as the start of the next segment
    if (time === nextKeyframe.time && i < keyframes.length - 2) {
      return {
        before: nextKeyframe,
        after: keyframes[i + 2],
      };
    }

    // Find the range that contains the time
    if (time >= currentKeyframe.time && time < nextKeyframe.time) {
      return {
        before: currentKeyframe,
        after: nextKeyframe,
      };
    }

    // Handle the case where time equals the last segment's start
    if (time === currentKeyframe.time && i === keyframes.length - 2) {
      return {
        before: currentKeyframe,
        after: nextKeyframe,
      };
    }
  }

  return null;
}

/**
 * Interpolate between two keyframes at a given time
 * @param keyframe1 - Starting keyframe
 * @param keyframe2 - Ending keyframe
 * @param time - Time to interpolate at
 * @returns Interpolated value
 */
export function interpolateKeyframes(
  keyframe1: Keyframe,
  keyframe2: Keyframe,
  time: number
): number {
  const value1 = typeof keyframe1.value === 'number' ? keyframe1.value : 0;
  const value2 = typeof keyframe2.value === 'number' ? keyframe2.value : 0;

  // Handle exact time matches
  if (time <= keyframe1.time) {
    return value1;
  }
  if (time >= keyframe2.time) {
    return value2;
  }

  // Calculate interpolation factor
  const duration = keyframe2.time - keyframe1.time;
  const elapsed = time - keyframe1.time;
  const t = duration > 0 ? elapsed / duration : 0;

  // For now, only linear interpolation
  // TODO: Implement other easing functions based on keyframe.easing
  return interpolateLinear(value1, value2, t);
}

/**
 * Get the interpolated value at a specific time for a set of keyframes
 * @param keyframes - Array of keyframes
 * @param time - Time to get value at
 * @returns Interpolated value at the given time
 */
export function getValueAtTime(keyframes: Keyframe[], time: number): number {
  // Handle empty array
  if (keyframes.length === 0) {
    return 0;
  }

  // Handle single keyframe
  if (keyframes.length === 1) {
    return typeof keyframes[0].value === 'number' ? keyframes[0].value : 0;
  }

  // Sort keyframes by time (in case they're not sorted)
  const sortedKeyframes = [...keyframes].sort((a, b) => a.time - b.time);

  // If time is before first keyframe, return first value
  if (time <= sortedKeyframes[0].time) {
    return typeof sortedKeyframes[0].value === 'number' ? sortedKeyframes[0].value : 0;
  }

  // If time is after last keyframe, return last value
  if (time >= sortedKeyframes[sortedKeyframes.length - 1].time) {
    const lastValue = sortedKeyframes[sortedKeyframes.length - 1].value;
    return typeof lastValue === 'number' ? lastValue : 0;
  }

  // Find surrounding keyframes and interpolate
  const bounds = findKeyframeBounds(sortedKeyframes, time);
  if (bounds) {
    return interpolateKeyframes(bounds.before, bounds.after, time);
  }

  // Fallback (should never reach here)
  return 0;
}
