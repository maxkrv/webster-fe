import Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { useRef, useState } from 'react';
import { Circle, Layer, Line, Rect, Stage, Star, Transformer } from 'react-konva';

import { useLeftSidebarStore } from '@/modules/home/hooks/use-left-sidebar-store';

import { useCanvasStore } from '../../../../shared/store/canvas-store';
import { useToolOptionsStore } from '../../hooks/tool-optios-store';
import { useCanvasContext } from '../../hooks/use-canvas-context';
import { usePanMode } from '../../hooks/use-pan-mode';
import { useStageContainerResize } from '../../hooks/use-stage-resize';
import { useStageZoom } from '../../hooks/use-stage-zoom';
import { StageGrid } from './stage-grid';

type Shape = {
  id: string;
  type: 'round' | 'square' | 'star' | 'rectangle' | 'circle' | 'triangle' | 'hexagon' | 'line';
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  showStroke?: boolean;
  shouldFill?: boolean; // for shapes
  x2?: number; // for line
  y2?: number; // for line
};

export const CanvasStage = () => {
  const { width, height, background, scale, opacity } = useCanvasStore();
  const { activeTool } = useLeftSidebarStore();
  const { brush, shape } = useToolOptionsStore();
  const [isDrawing, setIsDrawing] = useState(false);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const { stageRef } = useCanvasContext();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const { isPanMode } = usePanMode();

  const { handleDragStart, handleDragEnd, handleDragMove, handleWheel } = useStageZoom({
    setPosition,
    containerRef,
    position
  });

  useStageContainerResize({
    setPosition,
    setStageSize,
    containerRef
  });

  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  const MIN_DISTANCE = brush.brushSpacing;
  const isBrush = activeTool === 'brush';
  const isShapes = activeTool === 'shapes';

  const distance = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
  };

  const handleStageClick = (e: KonvaEventObject<MouseEvent>) => {
    if (e.target === e.currentTarget) {
      setSelectedId(null);
    }
  };

  if (stageSize.width <= 0 || stageSize.height <= 0) {
    return (
      <div
        ref={containerRef}
        className="relative flex flex-col items-center justify-center w-full h-full overflow-hidden">
        <div className="text-muted-foreground">Loading canvas...</div>
      </div>
    );
  }

  const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (!isBrush) return;
    const stage = e.target.getStage();
    const pos = stage?.getPointerPosition();
    if (!pos) return;

    let x = (pos.x - position.x) / scale;
    let y = (pos.y - position.y) / scale;

    const margin = brush.brushSize / 2;

    x = clamp(x, margin, width - margin);
    y = clamp(y, margin, height - margin);

    setIsDrawing(true);
    lastPointRef.current = { x, y };

    setShapes((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        type: brush.brushType,
        x,
        y,
        size: brush.brushSize,
        color: brush.brushColor,
        opacity: brush.brushOpacity
      }
    ]);
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isDrawing || !isBrush) return;
    const stage = e.target.getStage();
    const pos = stage?.getPointerPosition();
    if (!pos) return;

    let x = (pos.x - position.x) / scale;
    let y = (pos.y - position.y) / scale;

    const margin = brush.brushSize / 2;

    x = clamp(x, margin, width - margin);
    y = clamp(y, margin, height - margin);

    if (lastPointRef.current) {
      const dist = distance(lastPointRef.current, { x, y });
      if (dist < MIN_DISTANCE) {
        return;
      }
    }

    lastPointRef.current = { x, y };

    setShapes((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        type: brush.brushType,
        x,
        y,
        size: brush.brushSize,
        color: brush.brushColor,
        opacity: brush.brushOpacity
      }
    ]);
  };

  const handleMouseUp = () => {
    if (isBrush) {
      setIsDrawing(false);
      lastPointRef.current = null;
    }
  };

  // Add shape drawing logic
  const handleShapeMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (!isShapes) return;
    const stage = e.target.getStage();
    const pos = stage?.getPointerPosition();
    if (!pos) return;

    let x = (pos.x - position.x) / scale;
    let y = (pos.y - position.y) / scale;

    const margin = shape.shapeSize / 2;
    x = clamp(x, margin, width - margin);
    y = clamp(y, margin, height - margin);

    // For line, start drawing and store start point
    if (shape.shapeType === 'line') {
      setIsDrawing(true);
      lastPointRef.current = { x, y };
      setShapes((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          type: 'line',
          x,
          y,
          x2: x,
          y2: y,
          size: shape.shapeSize,
          color: shape.shapeColor,
          opacity: 1,
          strokeColor: shape.strokeColor,
          strokeWidth: shape.strokeWidth,
          showStroke: shape.showStroke,
          shouldFill: shape.shouldFill
        }
      ]);
      return;
    }

    // For other shapes, just add shape on click
    setShapes((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        type: shape.shapeType,
        x,
        y,
        size: shape.shapeSize,
        color: shape.shapeColor,
        opacity: 1,
        fillColor: shape.fillColor,
        strokeColor: shape.strokeColor,
        strokeWidth: shape.strokeWidth,
        showStroke: shape.showStroke,
        shouldFill: shape.shouldFill
      }
    ]);
  };

  // For line, update end point on mouse move
  const handleShapeMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isDrawing || !isShapes || shape.shapeType !== 'line') return;
    const stage = e.target.getStage();
    const pos = stage?.getPointerPosition();
    if (!pos) return;

    const x2 = (pos.x - position.x) / scale;
    const y2 = (pos.y - position.y) / scale;

    setShapes((prev) => {
      const shapesCopy = [...prev];
      const last = shapesCopy[shapesCopy.length - 1];
      if (last && last.type === 'line') {
        shapesCopy[shapesCopy.length - 1] = { ...last, x2, y2 };
      }
      return shapesCopy;
    });
  };

  const handleShapeMouseUp = () => {
    if (isShapes && shape.shapeType === 'line') {
      setIsDrawing(false);
      lastPointRef.current = null;
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center w-full h-full overflow-hidden bg-muted/20"
      style={{ cursor: isPanMode ? 'grab' : 'default' }}>
      <div className="absolute inset-0 overflow-hidden">
        <Stage
          ref={stageRef}
          width={stageSize.width}
          height={stageSize.height}
          onWheel={handleWheel}
          draggable={isPanMode}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragMove={handleDragMove}
          onMouseDown={isBrush ? handleMouseDown : isShapes ? handleShapeMouseDown : undefined}
          onMouseMove={isBrush ? handleMouseMove : isShapes ? handleShapeMouseMove : undefined}
          onMouseUp={isBrush ? handleMouseUp : isShapes ? handleShapeMouseUp : undefined}
          x={position.x}
          y={position.y}
          scale={{ x: scale, y: scale }}
          onClick={handleStageClick}
          className="canvas-stage">
          <Layer>
            <Rect
              x={0}
              y={0}
              width={width}
              height={height}
              fill={background}
              stroke="#ddd"
              strokeWidth={1}
              shadowColor="rgba(0,0,0,0.1)"
              shadowBlur={5}
              shadowOffset={{ x: 0, y: 0 }}
              shadowOpacity={0.5}
              opacity={opacity}
            />

            {shapes.map((shape) => {
              const {
                id,
                type,
                x,
                y,
                size,
                color,
                opacity,
                fillColor,
                strokeColor,
                strokeWidth,
                showStroke,
                shouldFill,
                x2,
                y2
              } = shape;
              switch (type) {
                case 'round':
                case 'circle':
                  return (
                    <Circle
                      key={id}
                      x={x}
                      y={y}
                      radius={size / 2}
                      fill={color || shouldFill ? fillColor || color : undefined}
                      opacity={opacity}
                      stroke={showStroke ? strokeColor : undefined}
                      strokeWidth={showStroke ? strokeWidth : 0}
                    />
                  );
                case 'square':
                case 'rectangle':
                  return (
                    <Rect
                      key={id}
                      x={x - size / 2}
                      y={y - size / 2}
                      width={size}
                      height={size}
                      fill={color || shouldFill ? fillColor || color : undefined}
                      opacity={opacity}
                      stroke={showStroke ? strokeColor : undefined}
                      strokeWidth={showStroke ? strokeWidth : 0}
                    />
                  );
                case 'star':
                  return (
                    <Star
                      key={id}
                      x={x}
                      y={y}
                      numPoints={5}
                      innerRadius={size / 4}
                      outerRadius={size / 2}
                      fill={color || shouldFill ? fillColor || color : undefined}
                      opacity={opacity}
                      stroke={showStroke ? strokeColor : undefined}
                      strokeWidth={showStroke ? strokeWidth : 0}
                    />
                  );
                case 'triangle':
                  // Draw triangle using react-konva Line
                  return (
                    <Line
                      key={id}
                      points={[x, y - size / 2, x - size / 2, y + size / 2, x + size / 2, y + size / 2]}
                      closed
                      fill={color || shouldFill ? fillColor || color : undefined}
                      opacity={opacity}
                      stroke={showStroke ? strokeColor : undefined}
                      strokeWidth={showStroke ? strokeWidth : 0}
                    />
                  );
                case 'hexagon':
                  // Draw hexagon using react-konva Line
                  return (
                    <Line
                      key={id}
                      points={Array.from({ length: 6 }).flatMap((_, i) => {
                        const angle = (Math.PI / 3) * i;
                        return [x + (size / 2) * Math.cos(angle), y + (size / 2) * Math.sin(angle)];
                      })}
                      closed
                      fill={shouldFill ? fillColor || color : undefined}
                      opacity={opacity}
                      stroke={showStroke ? strokeColor : undefined}
                      strokeWidth={showStroke ? strokeWidth : 0}
                    />
                  );
                case 'line':
                  return (
                    <Line
                      key={id}
                      points={[x, y, x2 ?? x, y2 ?? y]}
                      stroke={strokeColor || color}
                      strokeWidth={strokeWidth || 2}
                      opacity={opacity}
                    />
                  );
                default:
                  return null;
              }
            })}

            <Transformer
              ref={transformerRef}
              visible={!!selectedId}
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 5 || newBox.height < 5) {
                  return oldBox;
                }
                return newBox;
              }}
            />
          </Layer>

          <StageGrid />
        </Stage>
      </div>

      {isPanMode && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-background/80 backdrop-blur-sm rounded-md px-3 py-1 text-xs text-muted-foreground">
          Pan Mode (Space)
        </div>
      )}
    </div>
  );
};
