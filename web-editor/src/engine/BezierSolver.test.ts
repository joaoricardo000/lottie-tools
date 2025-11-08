import { describe, it, expect } from 'vitest';
import { BezierSolver } from './BezierSolver';

describe('BezierSolver', () => {
  describe('evaluateCubicBezier', () => {
    it('should return start point at t=0', () => {
      const result = BezierSolver.evaluateCubicBezier(0, 0, 0.25, 0.75, 1);
      expect(result).toBe(0);
    });

    it('should return end point at t=1', () => {
      const result = BezierSolver.evaluateCubicBezier(1, 0, 0.25, 0.75, 1);
      expect(result).toBe(1);
    });

    it('should evaluate linear bezier correctly', () => {
      // Linear: all control points in a line
      const result = BezierSolver.evaluateCubicBezier(0.5, 0, 0.33, 0.67, 1);
      expect(result).toBeCloseTo(0.5, 2);
    });

    it('should evaluate ease-in curve (quadratic-like)', () => {
      // Ease-in approximation
      // Note: Direct bezier evaluation at t=0.5 doesn't equal easing at x=0.5
      // This just tests that the bezier function works
      const result = BezierSolver.evaluateCubicBezier(0.5, 0, 0.42, 1, 1);
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(1);
    });

    it('should evaluate ease-out curve', () => {
      // Ease-out approximation
      const result = BezierSolver.evaluateCubicBezier(0.5, 0, 0, 0.58, 1);
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(1);
    });

    it('should handle control points outside [0,1] range (overshoot)', () => {
      // Overshoot on y-axis (elastic/bounce effects)
      const result = BezierSolver.evaluateCubicBezier(0.5, 0, 0.5, 0.5, 1.5);
      expect(result).toBeGreaterThan(0.5); // Can exceed normal range
    });

    it('should handle t values outside [0,1] range', () => {
      const resultNegative = BezierSolver.evaluateCubicBezier(-0.1, 0, 0.25, 0.75, 1);
      const resultOver = BezierSolver.evaluateCubicBezier(1.1, 0, 0.25, 0.75, 1);

      expect(resultNegative).toBeDefined();
      expect(resultOver).toBeDefined();
    });
  });

  describe('solveCubicBezierX', () => {
    it('should find t=0 for x=0', () => {
      const t = BezierSolver.solveCubicBezierX(0, 0, 0.33, 0.67, 1);
      expect(t).toBeCloseTo(0, 4);
    });

    it('should find t=1 for x=1', () => {
      const t = BezierSolver.solveCubicBezierX(1, 0, 0.33, 0.67, 1);
      expect(t).toBeCloseTo(1, 4);
    });

    it('should find t=0.5 for x=0.5 on linear curve', () => {
      const t = BezierSolver.solveCubicBezierX(0.5, 0, 0.33, 0.67, 1);
      expect(t).toBeCloseTo(0.5, 2);
    });

    it('should solve for ease-in curve', () => {
      const t = BezierSolver.solveCubicBezierX(0.5, 0, 0.42, 1, 1);
      expect(t).toBeGreaterThan(0);
      expect(t).toBeLessThan(1);

      // Verify by evaluating back
      const x = BezierSolver.evaluateCubicBezier(t, 0, 0.42, 1, 1);
      expect(x).toBeCloseTo(0.5, 3);
    });

    it('should solve for ease-out curve', () => {
      const t = BezierSolver.solveCubicBezierX(0.5, 0, 0, 0.58, 1);
      expect(t).toBeGreaterThan(0);
      expect(t).toBeLessThan(1);

      // Verify by evaluating back
      const x = BezierSolver.evaluateCubicBezier(t, 0, 0, 0.58, 1);
      expect(x).toBeCloseTo(0.5, 3);
    });

    it('should solve for ease-in-out curve', () => {
      const t = BezierSolver.solveCubicBezierX(0.5, 0, 0.333, 0.667, 1);
      expect(t).toBeGreaterThan(0);
      expect(t).toBeLessThan(1);

      // Verify
      const x = BezierSolver.evaluateCubicBezier(t, 0, 0.333, 0.667, 1);
      expect(x).toBeCloseTo(0.5, 3);
    });

    it('should solve for steep curves (fast acceleration)', () => {
      const t = BezierSolver.solveCubicBezierX(0.9, 0, 0.9, 0.9, 1);

      // Verify
      const x = BezierSolver.evaluateCubicBezier(t, 0, 0.9, 0.9, 1);
      expect(x).toBeCloseTo(0.9, 3);
    });

    it('should solve for shallow curves (slow acceleration)', () => {
      const t = BezierSolver.solveCubicBezierX(0.1, 0, 0.1, 0.1, 1);

      // Verify
      const x = BezierSolver.evaluateCubicBezier(t, 0, 0.1, 0.1, 1);
      expect(x).toBeCloseTo(0.1, 3);
    });

    it('should handle multiple intermediate points accurately', () => {
      const controlPoints = [0, 0.25, 0.75, 1];
      const testXValues = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];

      testXValues.forEach((targetX) => {
        const t = BezierSolver.solveCubicBezierX(targetX, ...controlPoints);
        const x = BezierSolver.evaluateCubicBezier(t, ...controlPoints);
        expect(x).toBeCloseTo(targetX, 3);
      });
    });

    it('should converge within reasonable iterations', () => {
      // Test that solver doesn't hang
      const start = Date.now();
      BezierSolver.solveCubicBezierX(0.5, 0, 0.42, 0.58, 1);
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(10); // Should be very fast (< 10ms)
    });

    it('should handle edge case: x slightly outside [0,1]', () => {
      // Sometimes floating point errors cause x to be slightly outside range
      const t1 = BezierSolver.solveCubicBezierX(-0.001, 0, 0.33, 0.67, 1);
      const t2 = BezierSolver.solveCubicBezierX(1.001, 0, 0.33, 0.67, 1);

      expect(t1).toBeGreaterThanOrEqual(0);
      expect(t1).toBeLessThanOrEqual(1);
      expect(t2).toBeGreaterThanOrEqual(0);
      expect(t2).toBeLessThanOrEqual(1);
    });

    it('should handle degenerate case: all control points equal', () => {
      const t = BezierSolver.solveCubicBezierX(0.5, 0.5, 0.5, 0.5, 0.5);
      expect(t).toBeCloseTo(0.5, 2);
    });
  });

  describe('easeBezier', () => {
    it('should evaluate y value for given x on linear curve', () => {
      const y = BezierSolver.easeBezier(0.5, 0, 0, 1, 1, 0, 0, 1, 1);
      expect(y).toBeCloseTo(0.5, 2);
    });

    it('should evaluate y for ease-in curve', () => {
      // Ease-in: slow start
      const y = BezierSolver.easeBezier(0.5, 0, 0.42, 1, 1, 0, 0, 1, 1);
      expect(y).toBeGreaterThan(0);
      expect(y).toBeLessThan(0.5); // y should lag behind x
    });

    it('should evaluate y for ease-out curve', () => {
      // Ease-out: fast start
      const y = BezierSolver.easeBezier(0.5, 0, 0, 0.58, 1, 0, 0, 1, 1);
      expect(y).toBeGreaterThan(0.5); // y should be ahead of x
      expect(y).toBeLessThan(1);
    });

    it('should handle y-axis overshoot (elastic effect)', () => {
      // Control points can cause y to go outside [0,1]
      const y = BezierSolver.easeBezier(0.5, 0, 0.5, 0.5, 1, 0, 1.5, 0.5, 1);
      // Result can be > 1 or < 0 depending on curve
      expect(y).toBeDefined();
      expect(typeof y).toBe('number');
    });

    it('should return 0 for x=0', () => {
      const y = BezierSolver.easeBezier(0, 0, 0.33, 0.67, 1, 0, 0.33, 0.67, 1);
      expect(y).toBeCloseTo(0, 4);
    });

    it('should return 1 for x=1', () => {
      const y = BezierSolver.easeBezier(1, 0, 0.33, 0.67, 1, 0, 0.33, 0.67, 1);
      expect(y).toBeCloseTo(1, 4);
    });

    it('should work with Lottie-style tangent format', () => {
      // Lottie format: {o: {x: [0.42], y: [0]}, i: {x: [1], y: [1]}}
      // Translates to: x: 0, 0.42, 1, 1 / y: 0, 0, 1, 1
      const y = BezierSolver.easeBezier(0.5, 0, 0.42, 1, 1, 0, 0, 1, 1);
      expect(y).toBeDefined();
      expect(y).toBeGreaterThan(0);
      expect(y).toBeLessThan(1);
    });

    it('should be consistent with multiple calls', () => {
      const y1 = BezierSolver.easeBezier(0.5, 0, 0.33, 0.67, 1, 0, 0.33, 0.67, 1);
      const y2 = BezierSolver.easeBezier(0.5, 0, 0.33, 0.67, 1, 0, 0.33, 0.67, 1);
      expect(y1).toBe(y2);
    });
  });

  describe('Edge cases and robustness', () => {
    it('should handle NaN inputs gracefully', () => {
      expect(() => {
        BezierSolver.evaluateCubicBezier(NaN, 0, 0.5, 0.5, 1);
      }).not.toThrow();
    });

    it('should handle Infinity inputs gracefully', () => {
      expect(() => {
        BezierSolver.evaluateCubicBezier(Infinity, 0, 0.5, 0.5, 1);
      }).not.toThrow();
    });

    it('should handle very small numbers', () => {
      const y = BezierSolver.easeBezier(0.0001, 0, 0.33, 0.67, 1, 0, 0.33, 0.67, 1);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThan(0.01);
    });

    it('should handle very large number of evaluations', () => {
      // Stress test
      const start = Date.now();
      for (let i = 0; i < 1000; i++) {
        BezierSolver.easeBezier(i / 1000, 0, 0.33, 0.67, 1, 0, 0.33, 0.67, 1);
      }
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(100); // Should handle 1000 evaluations in < 100ms
    });

    it('should handle reversed control points', () => {
      // Control points in reverse order (though not typical)
      const y = BezierSolver.easeBezier(0.5, 1, 0.67, 0.33, 0, 1, 0.67, 0.33, 0);
      expect(y).toBeDefined();
      expect(typeof y).toBe('number');
    });
  });

  describe('Preset easing curves validation', () => {
    it('should approximate CSS ease-in with bezier(0.42, 0, 1, 1)', () => {
      const y = BezierSolver.easeBezier(0.5, 0, 0.42, 1, 1, 0, 0, 1, 1);
      // Ease-in should be slower at start
      expect(y).toBeLessThan(0.5);
      expect(y).toBeGreaterThan(0);
    });

    it('should approximate CSS ease-out with bezier(0, 0, 0.58, 1)', () => {
      const y = BezierSolver.easeBezier(0.5, 0, 0, 0.58, 1, 0, 0, 1, 1);
      // Ease-out should be faster at start
      expect(y).toBeGreaterThan(0.5);
      expect(y).toBeLessThan(1);
    });

    it('should approximate CSS ease-in-out with bezier(0.42, 0, 0.58, 1)', () => {
      const y = BezierSolver.easeBezier(0.5, 0, 0.42, 0.58, 1, 0, 0, 1, 1);
      // Ease-in-out should be close to middle at t=0.5
      expect(y).toBeCloseTo(0.5, 1);
    });

    it('should approximate CSS ease with bezier(0.25, 0.1, 0.25, 1)', () => {
      const y = BezierSolver.easeBezier(0.5, 0, 0.25, 0.25, 1, 0, 0.1, 1, 1);
      expect(y).toBeDefined();
      expect(y).toBeGreaterThan(0);
      expect(y).toBeLessThan(1);
    });
  });
});
