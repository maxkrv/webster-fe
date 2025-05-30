import { Circle, Line, Rect, Star } from 'react-konva';

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

interface ShapeRendererProps {
  shape: Shape;
  penSmoothingValue: number;
}

const penStyles = {
  ballpoint: {
    lineCap: 'round' as const,
    lineJoin: 'round' as const,
    tensionFactor: 0.8,
    baseOpacity: 1,
    strokeWidthMultiplier: 1
  },
  fountain: {
    lineCap: 'round' as const,
    lineJoin: 'round' as const,
    tensionFactor: 0.4,
    baseOpacity: 0.8,
    strokeWidthMultiplier: 1.2
  },
  marker: {
    lineCap: 'square' as const,
    lineJoin: 'round' as const,
    tensionFactor: 0,
    baseOpacity: 0.5,
    strokeWidthMultiplier: 1.5
  }
};

export const ShapeRenderer = ({ shape, penSmoothingValue }: ShapeRendererProps) => {
  const {
    id,
    type,
    x,
    y,
    size,
    color,
    opacity,
    fillColor,
    strokeColor,
    strokeWidth,
    showStroke,
    shouldFill,
    hardness
  } = shape;

  switch (type) {
    case 'round':
    case 'circle':
      return (
        <Circle
          key={id}
          id={id}
          x={x}
          y={y}
          radius={size / 2}
          fill={color || shouldFill ? fillColor || color : undefined}
          opacity={opacity}
          stroke={showStroke ? strokeColor : undefined}
          strokeWidth={showStroke ? strokeWidth : 0}
        />
      );

    case 'square':
    case 'rectangle':
      return (
        <Rect
          key={id}
          id={id}
          x={x - size / 2}
          y={y - size / 2}
          width={size}
          height={size}
          fill={color || shouldFill ? fillColor || color : undefined}
          opacity={opacity}
          stroke={showStroke ? strokeColor : undefined}
          strokeWidth={showStroke ? strokeWidth : 0}
        />
      );

    case 'star':
      return (
        <Star
          key={id}
          id={id}
          x={x}
          y={y}
          numPoints={5}
          innerRadius={size / 4}
          outerRadius={size / 2}
          fill={color || shouldFill ? fillColor || color : undefined}
          opacity={opacity}
          stroke={showStroke ? strokeColor : undefined}
          strokeWidth={showStroke ? strokeWidth : 0}
        />
      );

    case 'triangle':
      return (
        <Line
          key={id}
          id={id}
          points={[x, y - size / 2, x - size / 2, y + size / 2, x + size / 2, y + size / 2]}
          closed
          fill={color || shouldFill ? fillColor || color : undefined}
          opacity={opacity}
          stroke={showStroke ? strokeColor : undefined}
          strokeWidth={showStroke ? strokeWidth : 0}
        />
      );

    case 'hexagon':
      return (
        <Line
          key={id}
          id={id}
          points={Array.from({ length: 6 }).flatMap((_, i) => {
            const angle = (Math.PI / 3) * i;
            return [x + (size / 2) * Math.cos(angle), y + (size / 2) * Math.sin(angle)];
          })}
          closed
          fill={shouldFill ? fillColor || color : undefined}
          opacity={opacity}
          stroke={showStroke ? strokeColor : undefined}
          strokeWidth={showStroke ? strokeWidth : 0}
        />
      );

    case 'polygon': {
      const isEraser = shape.tool === 'eraser';
      return (
        <Line
          key={id}
          id={id}
          closed
          points={shape.points || []}
          fill={shape.color}
          opacity={shape.opacity}
          globalCompositeOperation={isEraser ? 'destination-out' : 'source-over'}
          listening={false}
        />
      );
    }

    case 'line': {
      if (Array.isArray(shape.points)) {
        const style = penStyles[shape.penType || 'ballpoint'];
        const isEraser = shape.tool === 'eraser';
        const hardnessVal = hardness ?? 1;

        return (
          <Line
            key={id}
            points={shape.points}
            stroke={shape.strokeColor || shape.color}
            strokeWidth={(shape.strokeWidth || shape.size || 2) * (style.strokeWidthMultiplier || 1)}
            lineCap={style.lineCap}
            lineJoin={style.lineJoin}
            tension={(penSmoothingValue / 100) * (style.tensionFactor ?? 1)}
            opacity={(shape.opacity ?? 1) * (style.baseOpacity ?? 1) * (isEraser ? hardnessVal : 1)}
            globalCompositeOperation={isEraser ? 'destination-out' : 'source-over'}
          />
        );
      } else {
        return (
          <Line
            key={id}
            points={[shape.x, shape.y, shape.x2 ?? shape.x, shape.y2 ?? shape.y]}
            stroke={shape.strokeColor || shape.color}
            strokeWidth={shape.strokeWidth || shape.size || 2}
            opacity={shape.opacity}
          />
        );
      }
    }

    default:
      return null;
  }
};
