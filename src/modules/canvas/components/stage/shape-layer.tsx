'use client';
import Konva from 'konva';
import { useEffect, useRef } from 'react';
import { Layer } from 'react-konva';

import type { Shape } from '../../hooks/shapes-store';
import { useShapesStore } from '../../hooks/shapes-store';
import { ShapeRenderer } from './shape-renderer';

interface ShapeLayerProps {
  shapes: Shape[];
  selectedId: string | null;
  penSmoothingValue: number;
  onShapeSelect?: (id: string) => void;
}

export const ShapeLayer = ({ shapes, selectedId, penSmoothingValue, onShapeSelect }: ShapeLayerProps) => {
  const { selectedShapeIds } = useShapesStore();
  const transformerRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (selectedId) {
      const selectedNode = transformerRef.current?.getStage()?.findOne(`#${selectedId}`);
      if (selectedNode) {
        transformerRef.current?.nodes([selectedNode]);
        transformerRef.current?.getLayer()?.batchDraw();
      }
    } else {
      transformerRef.current?.nodes([]);
      transformerRef.current?.getLayer()?.batchDraw();
    }
  }, [selectedId]);

  return (
    <Layer>
      {shapes.map((shape) => (
        <ShapeRenderer
          key={shape.id}
          shape={shape}
          penSmoothingValue={penSmoothingValue}
          isSelected={selectedShapeIds.includes(shape.id)}
          onSelect={onShapeSelect}
        />
      ))}
    </Layer>
  );
};
