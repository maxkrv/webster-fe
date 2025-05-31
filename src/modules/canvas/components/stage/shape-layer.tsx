import type Konva from 'konva';
import { useRef } from 'react';
import { Layer, Transformer } from 'react-konva';

import { Shape } from '../../hooks/shapes-store';
import { ShapeRenderer } from './shape-renderer';

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
