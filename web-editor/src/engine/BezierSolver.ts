/**
 * BezierSolver - Cubic Bezier curve evaluation and solving
 *
 * Provides functions to:
 * 1. Evaluate cubic bezier curves at parameter t
 * 2. Solve inverse problem: find t for given x coordinate
 * 3. Calculate easing values using bezier curves (for animation)
 *
 * Based on standard cubic bezier mathematics and used for
 * implementing Lottie-compatible easing curves.
 */

export class BezierSolver {
  // Solver configuration
  private static readonly NEWTON_ITERATIONS = 8;
  private static readonly NEWTON_MIN_SLOPE = 0.001;
  private static readonly SUBDIVISION_PRECISION = 0.0000001;
  private static readonly SUBDIVISION_MAX_ITERATIONS = 10;

  /**
   * Evaluate a cubic bezier curve at parameter t
   * Uses the standard cubic bezier formula:
   * B(t) = (1-t)³*p0 + 3(1-t)²*t*p1 + 3(1-t)*t²*p2 + t³*p3
   *
   * @param t - Parameter (typically 0-1, but can be outside for extrapolation)
   * @param p0 - Start point (typically 0)
   * @param p1 - First control point
   * @param p2 - Second control point
   * @param p3 - End point (typically 1)
   * @returns Bezier curve value at parameter t
   */
  static evaluateCubicBezier(
    t: number,
    p0: number,
    p1: number,
    p2: number,
    p3: number
  ): number {
    // Handle NaN and Infinity
    if (!isFinite(t)) {
      return t > 0 ? p3 : p0;
    }

    // Cubic bezier formula using expanded form for efficiency
    const oneMinusT = 1 - t;
    const oneMinusTSquared = oneMinusT * oneMinusT;
    const oneMinusTCubed = oneMinusTSquared * oneMinusT;
    const tSquared = t * t;
    const tCubed = tSquared * t;

    return (
      oneMinusTCubed * p0 +
      3 * oneMinusTSquared * t * p1 +
      3 * oneMinusT * tSquared * p2 +
      tCubed * p3
    );
  }

  /**
   * Calculate the derivative of cubic bezier at parameter t
   * B'(t) = 3(1-t)²(p1-p0) + 6(1-t)t(p2-p1) + 3t²(p3-p2)
   *
   * Used by Newton-Raphson solver
   */
  private static evaluateCubicBezierDerivative(
    t: number,
    p0: number,
    p1: number,
    p2: number,
    p3: number
  ): number {
    const oneMinusT = 1 - t;
    const oneMinusTSquared = oneMinusT * oneMinusT;
    const tSquared = t * t;

    return (
      3 * oneMinusTSquared * (p1 - p0) +
      6 * oneMinusT * t * (p2 - p1) +
      3 * tSquared * (p3 - p2)
    );
  }

  /**
   * Solve for t given target x coordinate using Newton-Raphson method
   * This is the inverse problem: given x, find t where bezier(t).x = x
   *
   * @param targetX - Target x coordinate
   * @param x0 - Start x (typically 0)
   * @param x1 - First control point x
   * @param x2 - Second control point x
   * @param x3 - End x (typically 1)
   * @returns Parameter t where bezier curve has x coordinate = targetX
   */
  static solveCubicBezierX(
    targetX: number,
    x0: number,
    x1: number,
    x2: number,
    x3: number
  ): number {
    // Handle edge cases
    if (!isFinite(targetX)) {
      return targetX > 0 ? 1 : 0;
    }

    // Degenerate case: all points equal (horizontal line)
    if (x0 === x1 && x1 === x2 && x2 === x3) {
      // For a horizontal line, any t is valid
      // Return 0.5 as a reasonable middle value
      return 0.5;
    }

    // Clamp targetX to valid range (with small tolerance for floating point errors)
    if (targetX <= x0) return 0;
    if (targetX >= x3) return 1;

    // Initial guess: linear interpolation
    let t = (targetX - x0) / (x3 - x0);

    // Newton-Raphson iterations
    for (let i = 0; i < this.NEWTON_ITERATIONS; i++) {
      const currentX = this.evaluateCubicBezier(t, x0, x1, x2, x3);
      const derivative = this.evaluateCubicBezierDerivative(t, x0, x1, x2, x3);

      // Check if we've converged
      if (Math.abs(currentX - targetX) < this.SUBDIVISION_PRECISION) {
        return t;
      }

      // Check if derivative is too small (avoid division by very small number)
      if (Math.abs(derivative) < this.NEWTON_MIN_SLOPE) {
        break;
      }

      // Newton-Raphson step: t_new = t_old - f(t)/f'(t)
      t -= (currentX - targetX) / derivative;

      // Clamp t to valid range
      t = Math.max(0, Math.min(1, t));
    }

    // If Newton-Raphson didn't converge well, fall back to binary search
    return this.binarySearchForT(targetX, x0, x1, x2, x3);
  }

  /**
   * Binary search fallback for finding t
   * More robust but slower than Newton-Raphson
   */
  private static binarySearchForT(
    targetX: number,
    x0: number,
    x1: number,
    x2: number,
    x3: number
  ): number {
    let tMin = 0;
    let tMax = 1;
    let t = 0.5;

    for (let i = 0; i < this.SUBDIVISION_MAX_ITERATIONS; i++) {
      const currentX = this.evaluateCubicBezier(t, x0, x1, x2, x3);
      const diff = currentX - targetX;

      if (Math.abs(diff) < this.SUBDIVISION_PRECISION) {
        return t;
      }

      if (diff > 0) {
        tMax = t;
      } else {
        tMin = t;
      }

      t = (tMin + tMax) / 2;
    }

    return t;
  }

  /**
   * Calculate easing value using bezier curves
   * This is the main function used for animation easing
   *
   * Given an x coordinate (time progress 0-1), calculate the corresponding
   * y coordinate (value progress) using cubic bezier curves for both x and y.
   *
   * @param x - Input x coordinate (time progress, typically 0-1)
   * @param x0,x1,x2,x3 - X control points for bezier curve
   * @param y0,y1,y2,y3 - Y control points for bezier curve
   * @returns Y coordinate (eased value)
   *
   * @example
   * // Linear easing
   * easeBezier(0.5, 0, 0, 1, 1, 0, 0, 1, 1) // returns ~0.5
   *
   * @example
   * // Ease-in (slow start)
   * easeBezier(0.5, 0, 0.42, 1, 1, 0, 0, 1, 1) // returns < 0.5
   */
  static easeBezier(
    x: number,
    x0: number,
    x1: number,
    x2: number,
    x3: number,
    y0: number,
    y1: number,
    y2: number,
    y3: number
  ): number {
    // Handle edge cases
    if (!isFinite(x)) {
      return x > 0 ? y3 : y0;
    }

    // Clamp x to [x0, x3] range
    if (x <= x0) return y0;
    if (x >= x3) return y3;

    // Step 1: Find t where bezier_x(t) = x
    const t = this.solveCubicBezierX(x, x0, x1, x2, x3);

    // Step 2: Evaluate y at that t
    const y = this.evaluateCubicBezier(t, y0, y1, y2, y3);

    return y;
  }

  /**
   * Helper function to convert Lottie tangent format to bezier control points
   *
   * Lottie format:
   * {
   *   o: { x: [0.42], y: [0] },    // out tangent
   *   i: { x: [1], y: [1] }         // in tangent
   * }
   *
   * Maps to cubic bezier: (0, o.x[0], i.x[0], 1) for x-axis
   *                       (0, o.y[0], i.y[0], 1) for y-axis
   */
  static convertLottieTangentsToBezier(tangents: {
    o: { x: number[]; y: number[] };
    i: { x: number[]; y: number[] };
  }): {
    x: [number, number, number, number];
    y: [number, number, number, number];
  } {
    return {
      x: [0, tangents.o.x[0] ?? 0, tangents.i.x[0] ?? 1, 1],
      y: [0, tangents.o.y[0] ?? 0, tangents.i.y[0] ?? 1, 1],
    };
  }

  /**
   * Apply easing using Lottie tangent format
   * Convenience method that converts Lottie format and applies easing
   */
  static easeBezierFromLottieTangents(
    x: number,
    tangents: {
      o: { x: number[]; y: number[] };
      i: { x: number[]; y: number[] };
    }
  ): number {
    const bezier = this.convertLottieTangentsToBezier(tangents);
    return this.easeBezier(x, ...bezier.x, ...bezier.y);
  }
}
