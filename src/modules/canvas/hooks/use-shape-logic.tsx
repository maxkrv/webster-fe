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

interface UseShapeLogicProps {
  position: { x: number; y: number };
  scale: number;
  isDrawing: boolean;
  setIsDrawing: (drawing: boolean) => void;
  setShapes: React.Dispatch<React.SetStateAction<Shape[]>>;
}

export const useShapeLogic = ({ position, scale, isDrawing, setIsDrawing, setShapes }: UseShapeLogicProps) => {
  const { width, height } = useCanvasStore();
  const { activeTool } = useLeftSidebarStore();
  const { shape } = useToolOptionsStore();
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
  const isShapes = activeTool === 'shapes';

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

  return {
    handleShapeMouseDown,
    handleShapeMouseMove,
    handleShapeMouseUp
  };
};
