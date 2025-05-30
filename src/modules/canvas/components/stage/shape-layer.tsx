import type Konva from 'konva';
import { useRef } from 'react';
import { Layer, Transformer } from 'react-konva';

import { ShapeRenderer } from './shape-renderer';

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

interface ShapeLayerProps {
  shapes: Shape[];
  selectedId: string | null;
  penSmoothingValue: number;
}

export const ShapeLayer = ({ shapes, selectedId, penSmoothingValue }: ShapeLayerProps) => {
  const transformerRef = useRef<Konva.Transformer>(null);

  return (
    <Layer>
      {shapes.map((shape) => (
        <ShapeRenderer key={shape.id} shape={shape} penSmoothingValue={penSmoothingValue} />
      ))}

      <Transformer
        ref={transformerRef}
        visible={!!selectedId}
        boundBoxFunc={(oldBox, newBox) => {
          if (newBox.width < 5 || newBox.height < 5) {
            return oldBox;
          }
          return newBox;
        }}
      />
    </Layer>
  );
};
