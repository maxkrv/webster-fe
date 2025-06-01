'use client';

import type { KonvaEventObject } from 'konva/lib/Node';
import type React from 'react';
import { useCallback } from 'react';

import { useCanvasStore } from '@/shared/store/canvas-store';

import type { Shape } from './shapes-store';
import { useShapesStore } from './shapes-store';
import { useToolOptionsStore } from './tool-optios-store';

interface TextLogicProps {
  position: { x: number; y: number };
  scale: number;
  isDrawing: boolean;
  setIsDrawing: (isDrawing: boolean) => void;
  setShapes: React.Dispatch<React.SetStateAction<Shape[]>>;
}

export const useTextLogic = ({ position, scale, isDrawing, setIsDrawing, setShapes }: TextLogicProps) => {
  const { width, height } = useCanvasStore();
  const { text: textOptions, setToolOptions } = useToolOptionsStore();
  const { selectedShapeIds, setSelectedShapeIds } = useShapesStore();

  const getRelativePosition = useCallback(
    (pos: { x: number; y: number }) => {
      return {
        x: (pos.x - position.x) / scale,
        y: (pos.y - position.y) / scale
      };
    },
    [position, scale]
  );

  const handleTextMouseDown = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      const pos = e.target.getStage()?.getPointerPosition();
      if (!pos) return;

      const relativePos = getRelativePosition(pos);

      // Check if we clicked on a text element
      if (e.target.getClassName() === 'Text') {
        const textId = e.target.id();
        if (textId) {
          // Select the text element
          setSelectedShapeIds([textId]);
          setToolOptions('text', { selectedTextId: textId });
          e.cancelBubble = true;
          return;
        }
      }

      // Only create text if clicking on empty space and within canvas bounds
      if (
        e.target === e.currentTarget &&
        !isDrawing &&
        relativePos.x >= 0 &&
        relativePos.x <= width &&
        relativePos.y >= 0 &&
        relativePos.y <= height
      ) {
        const newTextId = Date.now().toString();
        const newText: Shape = {
          id: newTextId,
          type: 'text',
          x: relativePos.x,
          y: relativePos.y,
          text: 'Text',
          fontSize: textOptions.fontSize,
          fontFamily: textOptions.fontFamily,
          fontStyle: textOptions.fontStyle,
          align: textOptions.align,
          width: textOptions.width,
          padding: textOptions.padding,
          color: textOptions.textColor,
          size: textOptions.fontSize,
          opacity: 1
        };

        setShapes((prevShapes) => [...prevShapes, newText]);
        setIsDrawing(true);

        // Select the new text element
        setSelectedShapeIds([newTextId]);
        setToolOptions('text', { selectedTextId: newTextId });
      } else if (e.target === e.currentTarget) {
        // If clicking on empty space, deselect
        setSelectedShapeIds([]);
        setToolOptions('text', { selectedTextId: null });
      }
    },
    [
      isDrawing,
      getRelativePosition,
      width,
      height,
      textOptions,
      setShapes,
      setIsDrawing,
      setSelectedShapeIds,
      setToolOptions
    ]
  );

  const handleTextMouseUp = useCallback(() => {
    setIsDrawing(false);
  }, [setIsDrawing]);

  const handleTextDblClick = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      const textId = e.target.id();

      if (!textId) return;

      // Prevent event bubbling
      e.cancelBubble = true;

      // Select the text element if not already selected
      if (!selectedShapeIds.includes(textId)) {
        setSelectedShapeIds([textId]);
        setToolOptions('text', { selectedTextId: textId });
      }
    },
    [selectedShapeIds, setSelectedShapeIds, setToolOptions]
  );

  return {
    handleTextMouseDown,
    handleTextMouseUp,
    handleTextDblClick
  };
};
