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
  type: 'round' | 'square' | 'star' | 'rectangle' | 'circle' | 'triangle' | 'hexagon' | 'line' | 'polygon';
  x: number;
  y: number;
  size: number;
  color: string;
  points?: number[];
  opacity: number;
  penType?: 'ballpoint' | 'fountain' | 'marker';
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  showStroke?: boolean;
  shouldFill?: boolean;
  x2?: number;
  y2?: number;
  tool?: 'pen' | 'brush' | 'eraser';
  hardness?: number;
};

export const CanvasStage = () => {
  const { width, height, background, scale, opacity } = useCanvasStore();
  const { activeTool } = useLeftSidebarStore();
  const { brush, shape, pen, eraser } = useToolOptionsStore();
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

  const penStyles = {
    ballpoint: {
      lineCap: 'round' as const,
      lineJoin: 'round' as const,
      tensionFactor: 0.8,
      baseOpacity: 1,
      strokeWidthMultiplier: 1
    },
    fountain: {
      lineCap: 'round' as const,
      lineJoin: 'round' as const,
      tensionFactor: 0.4,
      baseOpacity: 0.8,
      strokeWidthMultiplier: 1.2
    },
    marker: {
      lineCap: 'square' as const,
      lineJoin: 'round' as const,
      tensionFactor: 0,
      baseOpacity: 0.5,
      strokeWidthMultiplier: 1.5
    }
  };

  const getFountainStrokeQuad = (
    p1: { x: number; y: number },
    p2: { x: number; y: number },
    width: number,
    angleDeg: number
  ): number[] => {
    const angle = (angleDeg * Math.PI) / 180;
    const dx = (Math.cos(angle) * width) / 2;
    const dy = (Math.sin(angle) * width) / 2;

    return [p1.x - dx, p1.y - dy, p1.x + dx, p1.y + dy, p2.x + dx, p2.y + dy, p2.x - dx, p2.y - dy];
  };

  const handleObjectEraser = (e: KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    const pointer = stage?.getPointerPosition();
    if (!pointer || eraser.eraserType !== 'object') return;

    const shapeNode = stage?.getIntersection(pointer);
    if (!shapeNode) return;

    const shapeId = shapeNode.id();

    setShapes((prevShapes) => prevShapes.filter((shape) => shape.id !== shapeId));
  };

  const handleDrawMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    const pos = stage?.getPointerPosition();
    if (!pos) return;

    const localX = (pos.x - position.x) / scale;
    const localY = (pos.y - position.y) / scale;

    const isBrush = activeTool === 'brush';
    const isPen = activeTool === 'pen';
    const isEraser = activeTool === 'eraser';

    if (isEraser && eraser.eraserType === 'object') {
      handleObjectEraser(e);
      return;
    }

    if (!isBrush && !isPen && !isEraser) return;

    const size = isBrush ? brush.brushSize : isPen ? pen.penSize : eraser.eraserSize;
    const color = isBrush ? brush.brushColor : isPen ? pen.penColor : '#000';
    const opacity = isBrush ? brush.brushOpacity : 1;
    const margin = size / 2;

    const x = clamp(localX, margin, width - margin);
    const y = clamp(localY, margin, height - margin);

    setIsDrawing(true);
    lastPointRef.current = { x, y };

    if (isBrush) {
      setShapes((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          type: brush.brushType,
          x,
          y,
          size,
          color,
          opacity,
          tool: 'brush'
        }
      ]);
    }

    if (isPen || isEraser) {
      const hardnessRaw = isEraser ? (eraser.eraserHardness ?? 100) : 100;
      const hardnessNormalized = (hardnessRaw - 1) / 99;
      setShapes((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          type: 'line',
          points: [x, y],
          strokeWidth: size,
          strokeColor: color,
          penType: isPen ? pen.penType : undefined,
          opacity,
          x: 0,
          y: 0,
          size: 0,
          color: '',
          tool: isPen ? 'pen' : 'eraser',
          hardness: hardnessNormalized
        }
      ]);
    }
  };

  const handleDrawMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isDrawing) return;

    const stage = e.target.getStage();
    const pos = stage?.getPointerPosition();
    if (!pos || !lastPointRef.current) return;

    const localX = (pos.x - position.x) / scale;
    const localY = (pos.y - position.y) / scale;

    const isBrush = activeTool === 'brush';
    const isPen = activeTool === 'pen';
    const isEraser = activeTool === 'eraser';

    if (!isBrush && !isPen && !isEraser) return;

    const size = isBrush ? brush.brushSize : isPen ? pen.penSize : eraser.eraserSize;
    const color = isBrush ? brush.brushColor : isPen ? pen.penColor : '#000';
    const opacity = isBrush ? brush.brushOpacity : 1;
    const spacing = isBrush ? brush.brushSpacing : 1;
    const margin = size / 2;

    const x = clamp(localX, margin, width - margin);
    const y = clamp(localY, margin, height - margin);

    const dist = distance(lastPointRef.current, { x, y });
    if (dist < spacing) return;

    if (isBrush) {
      lastPointRef.current = { x, y };
      setShapes((prevShapes) => [
        ...prevShapes,
        {
          id: String(Date.now()),
          type: brush.brushType,
          x,
          y,
          size,
          color,
          opacity,
          tool: 'brush'
        }
      ]);
    }

    if (isPen && pen.penType === 'fountain') {
      const last = lastPointRef.current;
      const quadPoints = getFountainStrokeQuad(last, { x, y }, size, 45);
      lastPointRef.current = { x, y };

      setShapes((prevShapes) => [
        ...prevShapes,
        {
          id: String(Date.now()),
          type: 'polygon',
          points: quadPoints,
          color,
          opacity,
          x: 0,
          y: 0,
          size: 0,
          tool: 'pen',
          penType: 'fountain'
        }
      ]);
    }

    if (isPen || isEraser) {
      lastPointRef.current = { x, y };
      setShapes((prevShapes) => {
        const shapesCopy = [...prevShapes];
        const lastShape = shapesCopy[shapesCopy.length - 1];
        if (lastShape && lastShape.type === 'line' && Array.isArray(lastShape.points)) {
          lastShape.points = [...lastShape.points, x, y];
          lastShape.opacity = opacity;
          if (isEraser) {
            const hardnessRaw = eraser.eraserHardness ?? 100;
            lastShape.hardness = (hardnessRaw - 1) / 99;
          }
        }
        return shapesCopy;
      });
    }
  };

  const handleDrawMouseUp = () => {
    if (activeTool === 'brush' || activeTool === 'pen' || activeTool === 'eraser') {
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
          onMouseDown={isShapes ? handleShapeMouseDown : handleDrawMouseDown}
          onMouseMove={isShapes ? handleShapeMouseMove : handleDrawMouseMove}
          onMouseUp={isShapes ? handleShapeMouseUp : handleDrawMouseUp}
          x={position.x}
          y={position.y}
          scale={{ x: scale, y: scale }}
          onClick={handleStageClick}
          className="canvas-stage">
          <Layer>
            <Rect x={0} y={0} width={width} height={height} fill={background} opacity={opacity} listening={false} />
          </Layer>
          <Layer>
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
                hardness
              } = shape;
              switch (type) {
                case 'round':
                case 'circle':
                  return (
                    <Circle
                      key={id}
                      id={id}
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
                      id={id}
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
                      id={id}
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
                      id={id}
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
                      id={id}
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
                case 'polygon': {
                  const isEraser = shape.tool === 'eraser';
                  return (
                    <Line
                      key={id}
                      id={id}
                      closed
                      points={shape.points || []}
                      fill={shape.color}
                      opacity={shape.opacity}
                      globalCompositeOperation={isEraser ? 'destination-out' : 'source-over'}
                      listening={false}
                    />
                  );
                }
                case 'line': {
                  if (Array.isArray(shape.points)) {
                    const style = penStyles[shape.penType || 'ballpoint'];
                    const isEraser = shape.tool === 'eraser';
                    const hardnessVal = hardness ?? 1;

                    return (
                      <Line
                        key={id}
                        points={shape.points}
                        stroke={shape.strokeColor || shape.color}
                        strokeWidth={(shape.strokeWidth || shape.size || 2) * (style.strokeWidthMultiplier || 1)}
                        lineCap={style.lineCap}
                        lineJoin={style.lineJoin}
                        tension={(pen.smoothing / 100) * (style.tensionFactor ?? 1)}
                        opacity={(shape.opacity ?? 1) * (style.baseOpacity ?? 1) * (isEraser ? hardnessVal : 1)}
                        globalCompositeOperation={isEraser ? 'destination-out' : 'source-over'}
                      />
                    );
                  } else {
                    return (
                      <Line
                        key={id}
                        points={[shape.x, shape.y, shape.x2 ?? shape.x, shape.y2 ?? shape.y]}
                        stroke={shape.strokeColor || shape.color}
                        strokeWidth={shape.strokeWidth || shape.size || 2}
                        opacity={shape.opacity}
                      />
                    );
                  }
                }
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
