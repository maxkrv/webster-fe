import type { KonvaEventObject } from 'konva/lib/Node';
import { Text } from 'konva/lib/shapes/Text';
import { useCallback, useRef } from 'react';

import { useCanvasStore } from '@/shared/store/canvas-store';

import { Shape } from './shapes-store';
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
  const { text: textOptions } = useToolOptionsStore();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

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
      if (isDrawing) return;

      const pos = e.target.getStage()?.getPointerPosition();
      if (!pos) return;

      const relativePos = getRelativePosition(pos);

      // Only create text if the click is within the canvas bounds
      if (relativePos.x >= 0 && relativePos.x <= width && relativePos.y >= 0 && relativePos.y <= height) {
        const newText: Shape = {
          id: Date.now().toString(),
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
          isEditing: true
        };

        setShapes((prevShapes) => [...prevShapes, newText]);
        setIsDrawing(true);
      }
    },
    [isDrawing, getRelativePosition, width, height, textOptions, setShapes, setIsDrawing]
  );

  const handleTextMouseUp = useCallback(() => {
    setIsDrawing(false);
  }, [setIsDrawing]);

  const handleTextDblClick = useCallback((e: KonvaEventObject<MouseEvent>) => {
    const textNode = e.target as Text;
    const textPosition = textNode.absolutePosition();
    const stageBox = textNode.getStage()?.container().getBoundingClientRect();

    if (!stageBox) return;

    // Create textarea over canvas
    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);

    textarea.value = textNode.text();
    textarea.style.position = 'absolute';
    textarea.style.top = `${stageBox.top + textPosition.y}px`;
    textarea.style.left = `${stageBox.left + textPosition.x}px`;
    textarea.style.width = `${textNode.width() - (textNode.padding() || 0) * 2}px`;
    textarea.style.height = `${textNode.height() - (textNode.padding() || 0) * 2}px`;
    textarea.style.fontSize = `${textNode.fontSize()}px`;
    textarea.style.border = 'none';
    textarea.style.padding = '0px';
    textarea.style.margin = '0px';
    textarea.style.overflow = 'hidden';
    textarea.style.background = 'none';
    textarea.style.outline = 'none';
    textarea.style.resize = 'none';
    textarea.style.lineHeight = textNode.lineHeight().toString();
    textarea.style.fontFamily = textNode.fontFamily();
    textarea.style.transformOrigin = 'left top';
    textarea.style.textAlign = textNode.align();
    textarea.style.color = textNode.fill() as string;

    textareaRef.current = textarea;
    textarea.focus();

    const removeTextarea = () => {
      textarea.parentNode?.removeChild(textarea);
      window.removeEventListener('click', handleOutsideClick);
      textareaRef.current = null;
    };

    const handleOutsideClick = (e: MouseEvent) => {
      if (e.target !== textarea) {
        textNode.text(textarea.value);
        removeTextarea();
      }
    };

    textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        textNode.text(textarea.value);
        removeTextarea();
      }
      if (e.key === 'Escape') {
        removeTextarea();
      }
    });

    window.addEventListener('click', handleOutsideClick);
  }, []);

  return {
    handleTextMouseDown,
    handleTextMouseUp,
    handleTextDblClick
  };
};
