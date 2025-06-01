'use client';

import type Konva from 'konva';
import type React from 'react';
import { useEffect, useRef } from 'react';

import { useShapesStore } from './shapes-store';

interface UseTransformerProps {
  selectedShapeIds: string[];
  stageRef: React.RefObject<Konva.Stage>;
}

export const useTransformer = ({ selectedShapeIds, stageRef }: UseTransformerProps) => {
  const transformerRef = useRef<Konva.Transformer>(null);
  const { updateShape, shapes } = useShapesStore();

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
    }
  }, [selectedShapeIds, stageRef, shapes]);

  // Update the handleTransformEnd function to handle star shapes differently
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

      const newWidth = currentWidth * scaleX;
      const newHeight = currentHeight * scaleY;

      // For star shapes, we'll keep the scaleX and scaleY instead of applying them to width/height
      if (shape.type === 'star') {
        updateShape(shapeId, {
          x,
          y,
          rotation,
          scaleX,
          scaleY
        });
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
