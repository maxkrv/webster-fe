'use client';

import type { KonvaEventObject } from 'konva/lib/Node';
import type React from 'react';
import { useRef } from 'react';

import { useLeftSidebarStore } from '@/modules/home/hooks/use-left-sidebar-store';
import { useCanvasStore } from '@/shared/store/canvas-store';

import { useToolOptionsStore } from '../hooks/tool-optios-store';
import type { Shape } from './shapes-store';
import { useCanvasHistory } from './use-canvas-history';

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
  const { pen, eraser } = useToolOptionsStore();
  const { saveToHistory } = useCanvasHistory();
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const drawingStartedRef = useRef(false);

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
    setShapes((prevShapes) => {
      const newShapes = prevShapes.filter((shape) => shape.id !== shapeId);
      // Save to history after erasing
      setTimeout(() => saveToHistory('Erase object'), 0);
      return newShapes;
    });
  };

  const handleDrawMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    const pos = stage?.getPointerPosition();
    if (!pos) return;

    const localX = (pos.x - position.x) / scale;
    const localY = (pos.y - position.y) / scale;

    // Check if within canvas bounds
    if (localX < 0 || localX > width || localY < 0 || localY > height) {
      return;
    }

    const isPen = activeTool === 'pen';
    const isEraser = activeTool === 'eraser';

    if (isEraser && eraser.eraserType === 'object') {
      handleObjectEraser(e);
      return;
    }

    if (!isPen && !isEraser) return;

    const size = isPen ? pen.penSize : eraser.eraserSize;
    const color = isPen ? pen.penColor : '#000';
    const opacity = 1;
    const margin = size / 2;

    const x = clamp(localX, margin, width - margin);
    const y = clamp(localY, margin, height - margin);

    setIsDrawing(true);
    drawingStartedRef.current = true;
    lastPointRef.current = { x, y };

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

    // Check if within canvas bounds
    if (localX < 0 || localX > width || localY < 0 || localY > height) {
      return;
    }

    const isPen = activeTool === 'pen';
    const isEraser = activeTool === 'eraser';

    if (!isPen && !isEraser) return;

    const size = isPen ? pen.penSize : eraser.eraserSize;
    const color = isPen ? pen.penColor : '#000';
    const opacity = 1;
    const margin = size / 2;

    const x = clamp(localX, margin, width - margin);
    const y = clamp(localY, margin, height - margin);

    const dist = distance(lastPointRef.current, { x, y });
    if (dist < 1) return;

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
    if (activeTool === 'pen' || activeTool === 'eraser') {
      setIsDrawing(false);
      lastPointRef.current = null;

      // Save to history only when drawing is complete
      if (drawingStartedRef.current) {
        drawingStartedRef.current = false;
        const toolName = activeTool === 'pen' ? 'Pen stroke' : 'Erase stroke';
        saveToHistory(toolName);
      }
    }
  };

  return {
    handleDrawMouseDown,
    handleDrawMouseMove,
    handleDrawMouseUp
  };
};
