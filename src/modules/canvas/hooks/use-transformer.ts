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

  // Handle transform end to update shape properties
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

    // Calculate absolute scale values
    const absScaleX = Math.abs(scaleX);
    const absScaleY = Math.abs(scaleY);

    // Get original dimensions
    const nodeWidth = node.width();
    const nodeHeight = node.height();

    // Calculate new dimensions
    const width = nodeWidth * absScaleX;
    const height = nodeHeight * absScaleY;

    // Find the shape to get its type
    const shape = shapes.find((s) => s.id === shapeId);
    if (!shape) return;

    // Prevent the shape renderer from handling this event
    e.cancelBubble = true;

    // Update shape based on its type
    if (shape.type === 'text') {
      // For text, we update font size and width
      const originalFontSize = shape.fontSize || 16;
      const newFontSize = Math.max(8, Math.round(originalFontSize * absScaleY));

      updateShape(shapeId, {
        x,
        y,
        rotation,
        fontSize: newFontSize,
        width: Math.max(20, width)
      });

      // Reset scale after applying to font size
      node.scaleX(1);
      node.scaleY(1);
      node.width(Math.max(20, width));
      node.height(newFontSize * 1.2); // Approximate text height
    } else if (shape.type === 'image') {
      // For images, update dimensions directly
      updateShape(shapeId, {
        x,
        y,
        rotation,
        width: Math.max(10, width),
        height: Math.max(10, height)
      });

      // Reset scale and update node dimensions
      node.scaleX(1);
      node.scaleY(1);
      node.width(Math.max(10, width));
      node.height(Math.max(10, height));
    } else if (shape.type === 'star' || shape.type === 'circle' || shape.type === 'round') {
      // For star and circle shapes, update size (use average of width/height)
      const newSize = Math.max(10, (width + height) / 2);

      updateShape(shapeId, {
        x,
        y,
        rotation,
        size: newSize
      });

      // Reset scale and update node dimensions
      node.scaleX(1);
      node.scaleY(1);
      // For circles, we need to update the radius properties
      if (node.getClassName() === 'Ellipse') {
        const ellipseNode = node as Konva.Ellipse;
        ellipseNode.radiusX(newSize / 2);
        ellipseNode.radiusY(newSize / 2);
      }
    } else {
      // For other shapes (rectangle, etc.), update width and height
      updateShape(shapeId, {
        x,
        y,
        rotation,
        width: Math.max(10, width),
        height: Math.max(10, height)
      });

      // Reset scale and update node dimensions
      node.scaleX(1);
      node.scaleY(1);
      node.width(Math.max(10, width));
      node.height(Math.max(10, height));
    }

    // Force redraw
    node.getLayer()?.batchDraw();
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
