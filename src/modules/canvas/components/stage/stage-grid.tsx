import { Line } from 'react-konva';

import { useCanvasStore } from '../../../../shared/store/canvas-store';

export const StageGrid = () => {
  const { width, height, showGrid } = useCanvasStore();

  if (!showGrid) return null;

  const gridLines = [];

  // Vertical lines
  for (let i = 0; i <= Math.ceil(width / 20); i++) {
    gridLines.push(
      <Line
        key={`v-${i}`}
        points={[i * 20, 0, i * 20, height]}
        stroke="#FF0000"
        strokeWidth={0.5}
        opacity={0.4}
        listening={false}
      />
    );
  }

  // Horizontal lines
  for (let i = 0; i <= Math.ceil(height / 20); i++) {
    gridLines.push(
      <Line
        key={`h-${i}`}
        points={[0, i * 20, width, i * 20]}
        stroke="#FF0000"
        strokeWidth={0.5}
        opacity={0.4}
        listening={false}
      />
    );
  }

  return <>{gridLines}</>;
};
