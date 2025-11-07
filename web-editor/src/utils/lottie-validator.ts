import type { LottieAnimation } from '../models/LottieTypes';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate a Lottie JSON structure
 */
export class LottieValidator {
  /**
   * Validate required fields are present and valid
   */
  static validate(lottie: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check if it's an object
    if (!lottie || typeof lottie !== 'object') {
      errors.push('Lottie data must be an object');
      return { valid: false, errors, warnings };
    }

    // Required fields
    if (!lottie.v) {
      errors.push('Missing required field: v (version)');
    }

    if (typeof lottie.fr !== 'number' || lottie.fr <= 0) {
      errors.push('Invalid or missing frame rate (fr): must be a positive number');
    }

    if (typeof lottie.ip !== 'number') {
      errors.push('Missing required field: ip (in point)');
    }

    if (typeof lottie.op !== 'number') {
      errors.push('Missing required field: op (out point)');
    }

    if (typeof lottie.w !== 'number' || lottie.w <= 0) {
      errors.push('Invalid or missing width (w): must be a positive number');
    }

    if (typeof lottie.h !== 'number' || lottie.h <= 0) {
      errors.push('Invalid or missing height (h): must be a positive number');
    }

    // Validate out point is after in point
    if (typeof lottie.ip === 'number' && typeof lottie.op === 'number') {
      if (lottie.op <= lottie.ip) {
        errors.push('Out point (op) must be greater than in point (ip)');
      }
    }

    // Layers
    if (!Array.isArray(lottie.layers)) {
      errors.push('Missing or invalid layers array');
    } else {
      if (lottie.layers.length === 0) {
        warnings.push('Animation has no layers');
      }

      // Validate each layer
      lottie.layers.forEach((layer: any, index: number) => {
        this.validateLayer(layer, index, errors, warnings);
      });
    }

    // Assets (optional but should be array if present)
    if (lottie.assets !== undefined && !Array.isArray(lottie.assets)) {
      errors.push('Assets must be an array');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validate a layer
   */
  private static validateLayer(layer: any, index: number, errors: string[], warnings: string[]): void {
    const layerPrefix = `Layer ${index}`;

    // Required layer fields
    if (typeof layer.ty !== 'number') {
      errors.push(`${layerPrefix}: Missing or invalid type (ty)`);
    }

    if (!layer.nm) {
      warnings.push(`${layerPrefix}: Missing name (nm)`);
    }

    if (typeof layer.ind !== 'number') {
      errors.push(`${layerPrefix}: Missing or invalid index (ind)`);
    }

    if (typeof layer.ip !== 'number') {
      errors.push(`${layerPrefix}: Missing or invalid in point (ip)`);
    }

    if (typeof layer.op !== 'number') {
      errors.push(`${layerPrefix}: Missing or invalid out point (op)`);
    }

    if (typeof layer.st !== 'number') {
      errors.push(`${layerPrefix}: Missing or invalid start time (st)`);
    }

    // Transform (ks)
    if (!layer.ks || typeof layer.ks !== 'object') {
      errors.push(`${layerPrefix}: Missing or invalid transform (ks)`);
    } else {
      this.validateTransform(layer.ks, layerPrefix, errors, warnings);
    }

    // Shape layers (type 4) should have shapes
    if (layer.ty === 4) {
      if (!Array.isArray(layer.shapes)) {
        errors.push(`${layerPrefix}: Shape layer missing shapes array`);
      } else if (layer.shapes.length === 0) {
        warnings.push(`${layerPrefix}: Shape layer has no shapes`);
      }
    }
  }

  /**
   * Validate transform object
   */
  private static validateTransform(transform: any, prefix: string, errors: string[], warnings: string[]): void {
    // Required transform properties
    const required = ['p', 'a', 's', 'r', 'o'];
    required.forEach(prop => {
      if (!transform[prop]) {
        errors.push(`${prefix} transform: Missing ${prop} property`);
      } else {
        this.validateAnimatedProperty(transform[prop], `${prefix} transform.${prop}`, errors, warnings);
      }
    });
  }

  /**
   * Validate animated property
   */
  private static validateAnimatedProperty(prop: any, path: string, errors: string[], warnings: string[]): void {
    if (!prop || typeof prop !== 'object') {
      errors.push(`${path}: Invalid animated property`);
      return;
    }

    // Must have 'a' (animated flag)
    if (typeof prop.a !== 'number' || (prop.a !== 0 && prop.a !== 1)) {
      errors.push(`${path}: Missing or invalid 'a' flag (must be 0 or 1)`);
    }

    // Must have 'k' (value/keyframes)
    if (prop.k === undefined) {
      errors.push(`${path}: Missing 'k' (value or keyframes)`);
    } else {
      // If animated, k should be an array
      if (prop.a === 1 && !Array.isArray(prop.k)) {
        errors.push(`${path}: Animated property 'k' must be an array of keyframes`);
      }

      // If animated, validate keyframes
      if (prop.a === 1 && Array.isArray(prop.k)) {
        prop.k.forEach((keyframe: any, i: number) => {
          if (typeof keyframe.t !== 'number') {
            errors.push(`${path} keyframe ${i}: Missing or invalid time (t)`);
          }
          if (!keyframe.s) {
            errors.push(`${path} keyframe ${i}: Missing start value (s)`);
          }
        });
      }
    }
  }

  /**
   * Check for NaN, Infinity, or undefined values recursively
   */
  static checkForInvalidNumbers(obj: any, path: string = 'root'): string[] {
    const issues: string[] = [];

    if (typeof obj === 'number') {
      if (Number.isNaN(obj)) {
        issues.push(`${path}: NaN value detected`);
      }
      if (!Number.isFinite(obj)) {
        issues.push(`${path}: Infinity value detected`);
      }
    } else if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        issues.push(...this.checkForInvalidNumbers(item, `${path}[${index}]`));
      });
    } else if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach(key => {
        issues.push(...this.checkForInvalidNumbers(obj[key], `${path}.${key}`));
      });
    }

    return issues;
  }

  /**
   * Validate and return user-friendly error message
   */
  static validateWithMessage(lottie: any): { valid: boolean; message: string } {
    const result = this.validate(lottie);
    const numberIssues = this.checkForInvalidNumbers(lottie);

    if (!result.valid) {
      return {
        valid: false,
        message: `Validation failed:\n${result.errors.join('\n')}`,
      };
    }

    if (numberIssues.length > 0) {
      return {
        valid: false,
        message: `Invalid number values detected:\n${numberIssues.join('\n')}`,
      };
    }

    if (result.warnings.length > 0) {
      return {
        valid: true,
        message: `Valid, but with warnings:\n${result.warnings.join('\n')}`,
      };
    }

    return { valid: true, message: 'Valid Lottie JSON' };
  }
}
