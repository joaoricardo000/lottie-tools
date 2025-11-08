/**
 * Property types that can be animated
 */
export type AnimatableProperty =
  | 'x'
  | 'y'
  | 'scaleX'
  | 'scaleY'
  | 'rotation'
  | 'opacity'
  | 'fill'
  | 'stroke'
  | 'strokeWidth';

/**
 * Easing function types
 */
export type EasingType = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'hold' | 'custom';

/**
 * Bezier curve tangent points for custom easing
 * Follows Lottie format: cubic bezier with control points
 * - o (out tangent): First control point, determines curve exiting current keyframe
 * - i (in tangent): Second control point, determines curve entering next keyframe
 * - x axis: Time (0 = current keyframe, 1 = next keyframe)
 * - y axis: Value interpolation factor (can overshoot [0,1] range)
 * - Arrays support per-dimension easing for vector properties
 */
export interface BezierTangents {
  o: { x: number[]; y: number[] }; // Out tangent
  i: { x: number[]; y: number[] }; // In tangent
}

/**
 * Value type for keyframes (can be number or string for colors)
 */
export type KeyframeValue = number | string;

/**
 * Keyframe represents a single animation keyframe
 */
export interface Keyframe {
  id: string;
  time: number; // Time in seconds
  property: AnimatableProperty;
  value: KeyframeValue;
  easing: EasingType;
  /**
   * Custom bezier tangents for easing
   * Only used when easing === 'custom'
   */
  easingBezier?: BezierTangents;
}

/**
 * Animation track for a specific property of a layer
 */
export interface PropertyTrack {
  layerId: string;
  property: AnimatableProperty;
  keyframes: Keyframe[];
}

/**
 * Complete animation data for the project
 */
export interface Animation {
  tracks: PropertyTrack[];
  duration: number; // Total duration in seconds
  fps: number; // Frames per second
  loop: boolean;
}
