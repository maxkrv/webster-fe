import { Layer, Line } from 'react-konva';

import { useCanvasStore } from '../../../../shared/store/canvas-store';

export const StageGrid = () => {
  const { width, height, showGrid } = useCanvasStore();

  if (!showGrid) return null;

  return (
    <Layer listening={false}>
      {Array.from({ length: Math.ceil(width / 20) }, (_, i) => (
        <Line key={`v-${i}`} points={[i * 20, 0, i * 20, height]} stroke="#FF0000" strokeWidth={0.5} opacity={0.4} />
      ))}
      {Array.from({ length: Math.ceil(height / 20) }, (_, i) => (
        <Line key={`h-${i}`} points={[0, i * 20, width, i * 20]} stroke="#FF0000" strokeWidth={0.5} opacity={0.4} />
      ))}
    </Layer>
  );
};
