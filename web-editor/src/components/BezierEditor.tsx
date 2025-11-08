import { useEffect, useRef, useState, useCallback } from 'react';
import './BezierEditor.css';
import type { BezierTangents } from '../models/Keyframe';

interface BezierEditorProps {
  /**
   * Current bezier tangent values
   * o.x[0], o.y[0] = out tangent control point
   * i.x[0], i.y[0] = in tangent control point
   */
  value: BezierTangents;

  /**
   * Callback when bezier values change
   */
  onChange: (value: BezierTangents) => void;

  /**
   * Optional width of the editor (default: 200)
   */
  width?: number;

  /**
   * Optional height of the editor (default: 200)
   */
  height?: number;
}

interface Point {
  x: number;
  y: number;
}

type DragHandle = 'p1' | 'p2' | null;

/**
 * Visual bezier curve editor with draggable control points
 * Displays a cubic bezier curve with two control points that can be dragged
 * Also provides numeric inputs for precise control
 */
export function BezierEditor({
  value,
  onChange,
  width = 200,
  height = 200,
}: BezierEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState<DragHandle>(null);
  const [hoveredHandle, setHoveredHandle] = useState<DragHandle>(null);

  // Extract control points from tangents
  // Lottie format: out tangent (o) and in tangent (i)
  // For a single keyframe transition: P0 = (0, 0), P1 = o, P2 = i, P3 = (1, 1)
  const p1 = {
    x: value.o.x[0] ?? 0,
    y: value.o.y[0] ?? 0,
  };
  const p2 = {
    x: value.i.x[0] ?? 1,
    y: value.i.y[0] ?? 1,
  };

  /**
   * Convert normalized coordinates (0-1) to canvas coordinates
   */
  const toCanvas = useCallback(
    (point: Point): Point => {
      const padding = 20;
      const graphWidth = width - padding * 2;
      const graphHeight = height - padding * 2;

      return {
        x: padding + point.x * graphWidth,
        y: padding + (1 - point.y) * graphHeight, // Flip Y axis
      };
    },
    [width, height]
  );

  /**
   * Convert canvas coordinates to normalized coordinates (0-1)
   */
  const fromCanvas = useCallback(
    (point: Point): Point => {
      const padding = 20;
      const graphWidth = width - padding * 2;
      const graphHeight = height - padding * 2;

      return {
        x: Math.max(0, Math.min(1, (point.x - padding) / graphWidth)),
        y: Math.max(0, Math.min(1, 1 - (point.y - padding) / graphHeight)), // Flip Y axis
      };
    },
    [width, height]
  );

  /**
   * Draw the bezier curve and control points
   */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    const padding = 20;
    const gridSize = 4;
    for (let i = 0; i <= gridSize; i++) {
      const x = padding + (i * (width - padding * 2)) / gridSize;
      const y = padding + (i * (height - padding * 2)) / gridSize;

      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw diagonal reference line (linear)
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    const p0Canvas = toCanvas({ x: 0, y: 0 });
    const p3Canvas = toCanvas({ x: 1, y: 1 });
    ctx.moveTo(p0Canvas.x, p0Canvas.y);
    ctx.lineTo(p3Canvas.x, p3Canvas.y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw control lines
    const p1Canvas = toCanvas(p1);
    const p2Canvas = toCanvas(p2);

    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(p0Canvas.x, p0Canvas.y);
    ctx.lineTo(p1Canvas.x, p1Canvas.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(p3Canvas.x, p3Canvas.y);
    ctx.lineTo(p2Canvas.x, p2Canvas.y);
    ctx.stroke();

    // Draw bezier curve
    ctx.strokeStyle = '#4a9eff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(p0Canvas.x, p0Canvas.y);
    ctx.bezierCurveTo(
      p1Canvas.x,
      p1Canvas.y,
      p2Canvas.x,
      p2Canvas.y,
      p3Canvas.x,
      p3Canvas.y
    );
    ctx.stroke();

    // Draw anchor points (start and end)
    ctx.fillStyle = '#999';
    ctx.beginPath();
    ctx.arc(p0Canvas.x, p0Canvas.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(p3Canvas.x, p3Canvas.y, 4, 0, Math.PI * 2);
    ctx.fill();

    // Draw control points
    const drawHandle = (point: Point, handle: DragHandle, label: string) => {
      const canvasPoint = toCanvas(point);
      const isHovered = hoveredHandle === handle;
      const isDraggingThis = isDragging === handle;

      // Handle circle
      ctx.fillStyle = isDraggingThis ? '#5aafff' : isHovered ? '#4a9eff' : '#fff';
      ctx.beginPath();
      ctx.arc(canvasPoint.x, canvasPoint.y, isDraggingThis ? 6 : 5, 0, Math.PI * 2);
      ctx.fill();

      // Handle stroke
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      if (isHovered || isDraggingThis) {
        ctx.fillStyle = '#fff';
        ctx.font = '11px sans-serif';
        ctx.fillText(label, canvasPoint.x + 8, canvasPoint.y - 8);
      }
    };

    drawHandle(p1, 'p1', 'Out');
    drawHandle(p2, 'p2', 'In');
  }, [width, height, p1, p2, toCanvas, hoveredHandle, isDragging]);

  // Redraw when values change
  useEffect(() => {
    draw();
  }, [draw]);

  /**
   * Get the handle at a given canvas position, if any
   */
  const getHandleAt = (canvasPoint: Point): DragHandle => {
    const p1Canvas = toCanvas(p1);
    const p2Canvas = toCanvas(p2);

    const dist1 = Math.hypot(canvasPoint.x - p1Canvas.x, canvasPoint.y - p1Canvas.y);
    const dist2 = Math.hypot(canvasPoint.x - p2Canvas.x, canvasPoint.y - p2Canvas.y);

    const hitRadius = 8;

    if (dist1 < hitRadius) return 'p1';
    if (dist2 < hitRadius) return 'p2';
    return null;
  };

  /**
   * Handle mouse down on canvas
   */
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const canvasPoint = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    const handle = getHandleAt(canvasPoint);
    if (handle) {
      setIsDragging(handle);
      e.preventDefault();
    }
  };

  /**
   * Handle mouse move on canvas
   */
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const canvasPoint = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    if (isDragging) {
      // Update the dragged handle
      const normalized = fromCanvas(canvasPoint);

      if (isDragging === 'p1') {
        onChange({
          o: { x: [normalized.x], y: [normalized.y] },
          i: { x: [p2.x], y: [p2.y] },
        });
      } else if (isDragging === 'p2') {
        onChange({
          o: { x: [p1.x], y: [p1.y] },
          i: { x: [normalized.x], y: [normalized.y] },
        });
      }
    } else {
      // Update hover state
      const handle = getHandleAt(canvasPoint);
      setHoveredHandle(handle);
    }
  };

  /**
   * Handle mouse up
   */
  const handleMouseUp = () => {
    setIsDragging(null);
  };

  /**
   * Handle mouse leave
   */
  const handleMouseLeave = () => {
    setIsDragging(null);
    setHoveredHandle(null);
  };

  /**
   * Handle numeric input changes
   */
  const handleNumericChange = (
    handle: 'p1' | 'p2',
    axis: 'x' | 'y',
    value: number
  ) => {
    const clampedValue = Math.max(0, Math.min(1, value));

    if (handle === 'p1') {
      const newP1 = { ...p1, [axis]: clampedValue };
      onChange({
        o: { x: [newP1.x], y: [newP1.y] },
        i: { x: [p2.x], y: [p2.y] },
      });
    } else {
      const newP2 = { ...p2, [axis]: clampedValue };
      onChange({
        o: { x: [p1.x], y: [p1.y] },
        i: { x: [newP2.x], y: [newP2.y] },
      });
    }
  };

  return (
    <div className="bezier-editor">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="bezier-canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: isDragging ? 'grabbing' : hoveredHandle ? 'grab' : 'default' }}
      />

      <div className="bezier-inputs">
        <div className="bezier-input-group">
          <label>Out Tangent</label>
          <div className="bezier-input-row">
            <span>X:</span>
            <input
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={p1.x.toFixed(2)}
              onChange={(e) => handleNumericChange('p1', 'x', Number(e.target.value))}
            />
            <span>Y:</span>
            <input
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={p1.y.toFixed(2)}
              onChange={(e) => handleNumericChange('p1', 'y', Number(e.target.value))}
            />
          </div>
        </div>

        <div className="bezier-input-group">
          <label>In Tangent</label>
          <div className="bezier-input-row">
            <span>X:</span>
            <input
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={p2.x.toFixed(2)}
              onChange={(e) => handleNumericChange('p2', 'x', Number(e.target.value))}
            />
            <span>Y:</span>
            <input
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={p2.y.toFixed(2)}
              onChange={(e) => handleNumericChange('p2', 'y', Number(e.target.value))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
