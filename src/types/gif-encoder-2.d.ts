/**
 * Type declarations for gif-encoder-2
 * This package doesn't include TypeScript definitions
 */

declare module 'gif-encoder-2' {
  import { Readable } from 'stream';

  class GIFEncoder {
    constructor(
      width: number,
      height: number,
      algorithm?: 'neuquant' | 'octree',
      useOptimizer?: boolean,
      totalFrames?: number
    );

    start(): void;
    finish(): void;
    addFrame(data: Buffer | Uint8Array | Uint8ClampedArray): void;
    setDelay(milliseconds: number): void;
    setRepeat(repeat: number): void;
    setQuality(quality: number): void;
    setThreshold(threshold: number): void;
    setTransparent(color: number): void;
    createReadStream(): Readable;
  }

  export = GIFEncoder;
}
