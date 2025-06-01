'use client';

import type { KonvaEventObject } from 'konva/lib/Node';
import type React from 'react';
import { useRef } from 'react';

import { useLeftSidebarStore } from '@/modules/home/hooks/use-left-sidebar-store';
import { useCanvasStore } from '@/shared/store/canvas-store';

import { useToolOptionsStore } from '../hooks/tool-optios-store';
import type { Shape } from './shapes-store';

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

    // Create a base shape object with common properties
    const baseShape = {
      id: String(Date.now()),
      x,
      y,
      size: shape.shapeSize,
      color: shape.shapeColor,
      opacity: 1,
      fillColor: shape.fillColor,
      strokeColor: shape.strokeColor,
      strokeWidth: shape.strokeWidth,
      showStroke: shape.showStroke,
      shouldFill: shape.shouldFill,
      width: shape.shapeSize,
      height: shape.shapeSize
    };

    // For line, start drawing and store start point
    if (shape.shapeType === 'line') {
      setIsDrawing(true);
      lastPointRef.current = { x, y };
      setShapes((prev) => [
        ...prev,
        {
          ...baseShape,
          type: 'line',
          x2: x,
          y2: y
        }
      ]);
      return;
    }

    // For star shapes, we'll use scaleX and scaleY for deformation
    if (shape.shapeType === 'star') {
      setShapes((prev) => [
        ...prev,
        {
          ...baseShape,
          type: 'star',
          scaleX: 1,
          scaleY: 1
        }
      ]);
      return;
    }

    // For circle shapes
    if (shape.shapeType === 'circle') {
      console.log('shape.shapeSize', shape.shapeSize);
      setShapes((prev) => [
        ...prev,
        {
          ...baseShape,
          type: 'circle'
        }
      ]);
      return;
    }

    // For other shapes
    setShapes((prev) => [
      ...prev,
      {
        ...baseShape,
        type: shape.shapeType
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
        const width = Math.abs(x2 - last.x) * 2;
        const height = Math.abs(y2 - last.y) * 2;
        shapesCopy[shapesCopy.length - 1] = {
          ...last,
          x2,
          y2,
          width: Math.max(width, 1),
          height: Math.max(height, 1)
        };
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
