'use client';

import type Konva from 'konva';
import type React from 'react';
import { useEffect, useRef } from 'react';

import { useShapesStore } from './shapes-store';
import { useToolOptionsStore } from './tool-optios-store';

interface UseTransformerProps {
  selectedShapeIds: string[];
  stageRef: React.RefObject<Konva.Stage>;
}

export const useTransformer = ({ selectedShapeIds, stageRef }: UseTransformerProps) => {
  const transformerRef = useRef<Konva.Transformer>(null);
  const { updateShape, shapes } = useShapesStore();
  const { setToolOptions } = useToolOptionsStore();

  useEffect(() => {
    const transformer = transformerRef.current;
    const stage = stageRef.current;

    if (!transformer || !stage) return;

    if (selectedShapeIds.length === 0) {
      transformer.nodes([]);
      return;
    }

    // Find selected nodes
    const selectedNodes = selectedShapeIds.map((id) => stage.findOne(`#${id}`)).filter(Boolean) as Konva.Node[];

    if (selectedNodes.length > 0) {
      transformer.nodes(selectedNodes);
      transformer.getLayer()?.batchDraw();

      // If there's a single text node selected, update the text tool options
      if (selectedNodes.length === 1 && selectedNodes[0].getClassName() === 'Text') {
        const textNode = selectedNodes[0] as Konva.Text;
        const textId = textNode.id();

        // Update the selected text ID in the tool options
        setToolOptions('text', { selectedTextId: textId });
      } else {
        // Clear selected text ID if no text is selected
        setToolOptions('text', { selectedTextId: null });
      }
    }
  }, [selectedShapeIds, stageRef, shapes, setToolOptions]);

  // Update the handleTransformEnd function to handle text shapes differently
  const handleTransformEnd = (e: Konva.KonvaEventObject<Event>) => {
    const node = e.target;
    const shapeId = node.id();

    if (!shapeId) return;

    // Get the current transform values
    const x = node.x();
    const y = node.y();
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    const rotation = node.rotation();

    // Find the shape to get its current dimensions
    const shape = shapes.find((s) => s.id === shapeId);
    if (shape) {
      // Calculate new dimensions based on scale
      const currentWidth = shape.width || shape.size;
      const currentHeight = shape.height || shape.size;

      const newWidth = currentWidth * Math.abs(scaleX);
      const newHeight = currentHeight * Math.abs(scaleY);

      // For text shapes, we need to handle font size differently
      if (shape.type === 'text') {
        // For text, we scale the font size but keep the width as is
        const newFontSize = Math.round((shape.fontSize || 16) * Math.abs(scaleY));

        updateShape(shapeId, {
          x,
          y,
          rotation,
          fontSize: newFontSize,
          width: newWidth,
          scaleX: 1,
          scaleY: 1
        });

        // Reset the node's scale to 1 since we've applied it to the font size
        node.scaleX(1);
        node.scaleY(1);
      } else if (shape.type === 'image' && shape.cropActive) {
        // For images in crop mode, we adjust the crop parameters
        const originalCropWidth = shape.cropWidth || shape.originalWidth || currentWidth;
        const originalCropHeight = shape.cropHeight || shape.originalHeight || currentHeight;

        // Calculate new crop dimensions
        const newCropWidth = originalCropWidth * Math.abs(scaleX);
        const newCropHeight = originalCropHeight * Math.abs(scaleY);

        updateShape(shapeId, {
          x,
          y,
          rotation,
          // Update crop values based on scale
          cropWidth: newCropWidth,
          cropHeight: newCropHeight,
          // Keep the display size the same as the crop size
          width: newCropWidth,
          height: newCropHeight,
          // Reset scale to 1 after applying to crop dimensions
          scaleX: 1,
          scaleY: 1
        });

        // Reset the node's scale
        node.scaleX(1);
        node.scaleY(1);
      } else if (shape.type === 'star') {
        // For star shapes, we'll keep the scaleX and scaleY instead of applying them to width/height
        updateShape(shapeId, {
          x,
          y,
          rotation,
          scaleX,
          scaleY
        });
      } else if (shape.type === 'rectangle' || shape.type === 'square') {
        // For rectangles, handle negative scaling properly
        updateShape(shapeId, {
          x,
          y,
          rotation,
          width: newWidth,
          height: newHeight,
          scaleX: scaleX < 0 ? -1 : 1, // Preserve flip state
          scaleY: scaleY < 0 ? -1 : 1 // Preserve flip state
        });

        // Reset the node's scale to preserve flip state
        node.scaleX(scaleX < 0 ? -1 : 1);
        node.scaleY(scaleY < 0 ? -1 : 1);
      } else {
        // For other shapes, apply scale to dimensions and reset scale
        updateShape(shapeId, {
          x,
          y,
          rotation,
          width: newWidth,
          height: newHeight,
          scaleX: 1, // Reset scale to 1 after applying to dimensions
          scaleY: 1
        });

        // Reset the node's scale to 1 since we've applied it to the shape dimensions
        node.scaleX(1);
        node.scaleY(1);
      }
    }
  };

  // Handle drag end to update position
  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target;
    const shapeId = node.id();

    if (!shapeId) return;

    updateShape(shapeId, {
      x: node.x(),
      y: node.y()
    });
  };

  return {
    transformerRef,
    handleTransformEnd,
    handleDragEnd
  };
};
