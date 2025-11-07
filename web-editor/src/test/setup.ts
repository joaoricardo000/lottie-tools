import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock canvas context for lottie-web tests
const mockContext = {
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 1,
  lineCap: 'butt',
  lineJoin: 'miter',
  miterLimit: 10,
  globalAlpha: 1,
  globalCompositeOperation: 'source-over',
  clearRect: vi.fn(),
  fillRect: vi.fn(),
  strokeRect: vi.fn(),
  beginPath: vi.fn(),
  closePath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  bezierCurveTo: vi.fn(),
  quadraticCurveTo: vi.fn(),
  arc: vi.fn(),
  arcTo: vi.fn(),
  rect: vi.fn(),
  fill: vi.fn(),
  stroke: vi.fn(),
  clip: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  scale: vi.fn(),
  rotate: vi.fn(),
  translate: vi.fn(),
  transform: vi.fn(),
  setTransform: vi.fn(),
  resetTransform: vi.fn(),
  setLineDash: vi.fn(),
  getLineDash: vi.fn(() => []),
  drawImage: vi.fn(),
  createLinearGradient: vi.fn(() => ({
    addColorStop: vi.fn(),
  })),
  createRadialGradient: vi.fn(() => ({
    addColorStop: vi.fn(),
  })),
  createPattern: vi.fn(),
  measureText: vi.fn(() => ({ width: 0 })),
  fillText: vi.fn(),
  strokeText: vi.fn(),
  getImageData: vi.fn(() => ({
    data: new Uint8ClampedArray(0),
    width: 0,
    height: 0,
  })),
  putImageData: vi.fn(),
  canvas: null as any,
};

// Mock HTMLCanvasElement.getContext globally
HTMLCanvasElement.prototype.getContext = vi.fn((contextType: string) => {
  if (contextType === '2d') {
    return mockContext as any;
  }
  return null;
});
