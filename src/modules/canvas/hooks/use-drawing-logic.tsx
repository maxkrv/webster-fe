import type { KonvaEventObject } from 'konva/lib/Node';
import type React from 'react';
import { useRef } from 'react';

import { useLeftSidebarStore } from '@/modules/home/hooks/use-left-sidebar-store';
import { useCanvasStore } from '@/shared/store/canvas-store';

import { useToolOptionsStore } from '../hooks/tool-optios-store';

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

interface UseDrawingLogicProps {
  position: { x: number; y: number };
  scale: number;
  isDrawing: boolean;
  setIsDrawing: (drawing: boolean) => void;
  setShapes: React.Dispatch<React.SetStateAction<Shape[]>>;
}

export const useDrawingLogic = ({ position, scale, isDrawing, setIsDrawing, setShapes }: UseDrawingLogicProps) => {
  const { width, height } = useCanvasStore();
  const { activeTool } = useLeftSidebarStore();
  const { brush, pen, eraser } = useToolOptionsStore();
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

  const distance = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
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

  return {
    handleDrawMouseDown,
    handleDrawMouseMove,
    handleDrawMouseUp
  };
};
