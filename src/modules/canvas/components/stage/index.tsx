import type { KonvaEventObject } from 'konva/lib/Node';
import { useRef, useState } from 'react';
import { Layer, Stage } from 'react-konva';

import { useLeftSidebarStore } from '@/modules/home/hooks/use-left-sidebar-store';

import { useCanvasStore } from '../../../../shared/store/canvas-store';
import { useToolOptionsStore } from '../../hooks/tool-optios-store';
import { useCanvasContext } from '../../hooks/use-canvas-context';
import { useDrawingLogic } from '../../hooks/use-drawing-logic';
import { usePanMode } from '../../hooks/use-pan-mode';
import { useShapeLogic } from '../../hooks/use-shape-logic';
import { useStageContainerResize } from '../../hooks/use-stage-resize';
import { useStageZoom } from '../../hooks/use-stage-zoom';
import { CanvasBackground } from './canvas-background';
import { ShapeLayer } from './shape-layer';
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
  const { scale } = useCanvasStore();
  const { activeTool } = useLeftSidebarStore();
  const { pen } = useToolOptionsStore();
  const [isDrawing, setIsDrawing] = useState(false);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const { stageRef } = useCanvasContext();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [selectedId, setSelectedId] = useState<string | null>(null);
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

  const drawingLogic = useDrawingLogic({
    position,
    scale,
    isDrawing,
    setIsDrawing,
    setShapes
  });

  const shapeLogic = useShapeLogic({
    position,
    scale,
    isDrawing,
    setIsDrawing,
    setShapes
  });

  const isShapes = activeTool === 'shapes';

  const handleStageClick = (e: KonvaEventObject<MouseEvent>) => {
    if (e.target === e.currentTarget) {
      setSelectedId(null);
    }
  };

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (isShapes) {
      shapeLogic.handleShapeMouseDown(e);
    } else {
      drawingLogic.handleDrawMouseDown(e);
    }
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (isShapes) {
      shapeLogic.handleShapeMouseMove(e);
    } else {
      drawingLogic.handleDrawMouseMove(e);
    }
  };

  const handleMouseUp = () => {
    if (isShapes) {
      shapeLogic.handleShapeMouseUp();
    } else {
      drawingLogic.handleDrawMouseUp();
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
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          x={position.x}
          y={position.y}
          scale={{ x: scale, y: scale }}
          onClick={handleStageClick}
          className="canvas-stage">
          <Layer>
            <CanvasBackground />
          </Layer>

          <ShapeLayer shapes={shapes} selectedId={selectedId} penSmoothingValue={pen.smoothing} />

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
