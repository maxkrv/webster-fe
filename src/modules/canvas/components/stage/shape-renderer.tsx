'use client';

import type Konva from 'konva';
import { Ellipse, Image, Line, Rect, Star, Text } from 'react-konva';

import type { Shape } from '../../hooks/shapes-store';
import { useShapesStore } from '../../hooks/shapes-store';

interface ShapeRendererProps {
  shape: Shape;
  penSmoothingValue: number;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
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
    lineCap: 'round' as const,
    lineJoin: 'round' as const,
    tensionFactor: 0.3,
    baseOpacity: 0.7,
    strokeWidthMultiplier: 2.0
  }
};

export const ShapeRenderer = ({ shape, penSmoothingValue, isSelected = false, onSelect }: ShapeRendererProps) => {
  const {
    id,
    type,
    x,
    y,
    size,
    color,
    opacity,
    fillColor,
    fillOpacity = 0.8,
    strokeColor,
    strokeWidth,
    showStroke,
    shouldFill,
    hardness,
    width,
    height,
    text,
    fontSize,
    fontFamily,
    fontStyles,
    align,
    padding,
    rotation = 0,
    scaleX = 1,
    scaleY = 1,
    imageElement,
    flipX,
    flipY,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    cropActive
  } = shape;

  // Get the updateShape function from the store
  const { updateShape } = useShapesStore();

  // Calculate actual dimensions - prioritize width/height over size
  const actualWidth = width || size || 100;
  const actualHeight = height || size || 100;

  // Selection highlight properties
  const selectionStroke = isSelected ? '#007AFF' : undefined;
  const selectionStrokeWidth = isSelected ? 2 : 0;
  const selectionDash = isSelected ? [5, 5] : undefined;

  const handleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Stop event propagation to prevent canvas click
    e.cancelBubble = true;

    if (onSelect) {
      onSelect(id);
    }
  };

  // Handle drag end to save position
  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target;
    const newX = node.x();
    const newY = node.y();

    // Update position for all shapes consistently
    updateShape(id, {
      x: newX,
      y: newY
    });
  };

  const commonProps = {
    id,
    onClick: handleClick,
    stroke: selectionStroke || (showStroke ? strokeColor : undefined),
    strokeWidth: selectionStrokeWidth || (showStroke ? strokeWidth || 2 : 0),
    strokeScaleEnabled: false,
    dash: selectionDash,
    listening: true,
    draggable: isSelected,
    x,
    y,
    rotation,
    scaleX,
    scaleY,
    fillOpacity: shouldFill ? fillOpacity : undefined,
    onDragEnd: handleDragEnd
  };

  switch (type) {
    case 'image':
      if (!imageElement) {
        return (
          <Rect
            key={id}
            width={actualWidth}
            height={actualHeight}
            fill="#f0f0f0"
            {...commonProps}
            stroke="#ccc"
            strokeWidth={1}
            strokeScaleEnabled={false}
            dash={[5, 5]}
            opacity={0.5}
            offsetX={actualWidth / 2}
            offsetY={actualHeight / 2}
          />
        );
      }

      return (
        <Image
          key={id}
          image={imageElement}
          width={actualWidth}
          height={actualHeight}
          {...commonProps}
          opacity={opacity}
          scaleX={(flipX ? -1 : 1) * (scaleX || 1)}
          scaleY={(flipY ? -1 : 1) * (scaleY || 1)}
          crop={
            cropActive
              ? {
                  x: cropX ?? 0,
                  y: cropY ?? 0,
                  width: cropWidth ?? imageElement.naturalWidth,
                  height: cropHeight ?? imageElement.naturalHeight
                }
              : undefined
          }
          offsetX={actualWidth / 2}
          offsetY={actualHeight / 2}
          onMouseEnter={(e) => {
            const container = e.target.getStage()?.container();
            if (container) {
              container.style.cursor = 'pointer';
            }
          }}
          onMouseLeave={(e) => {
            const container = e.target.getStage()?.container();
            if (container) {
              container.style.cursor = 'default';
            }
          }}
        />
      );

    case 'text': {
      // Handle backward compatibility - convert old fontStyle to fontStyles if needed
      const fontStyle = fontStyles || '';

      return (
        <Text
          key={id}
          id={id}
          x={x}
          y={y}
          text={text || ''}
          fontSize={fontSize}
          fontFamily={fontFamily}
          fontStyle={fontStyle}
          align={align}
          width={width}
          padding={padding}
          fill={color}
          opacity={opacity}
          listening={true}
          onClick={handleClick}
          onDblClick={(e) => {
            e.cancelBubble = true;
          }}
          hitStrokeWidth={Math.max(fontSize || 16, 20)}
          onMouseEnter={(e) => {
            const container = e.target.getStage()?.container();
            if (container) {
              container.style.cursor = 'text';
            }
          }}
          onMouseLeave={(e) => {
            const container = e.target.getStage()?.container();
            if (container) {
              container.style.cursor = 'default';
            }
          }}
          attrs={{
            'data-text-id': id
          }}
          onDragEnd={handleDragEnd}
          draggable={isSelected}
          // Add offsetX to center the text properly
          offsetX={width ? width / 2 : 0}
        />
      );
    }

    case 'round':
    case 'circle': {
      return (
        <Ellipse
          key={id}
          radiusX={actualWidth / 2}
          radiusY={actualHeight / 2}
          fill={shouldFill ? fillColor || color : undefined}
          opacity={shouldFill ? opacity * fillOpacity : opacity}
          {...commonProps}
        />
      );
    }

    case 'square':
    case 'rectangle':
      return (
        <Rect
          key={id}
          width={actualWidth}
          height={actualHeight}
          fill={shouldFill ? fillColor || color : undefined}
          opacity={shouldFill ? opacity * fillOpacity : opacity}
          {...commonProps}
          offsetX={actualWidth / 2}
          offsetY={actualHeight / 2}
        />
      );

    case 'star': {
      // Use a base size for the star and let scaleX/scaleY handle the stretching
      const baseSize = size || 100;
      return (
        <Star
          key={id}
          numPoints={5}
          innerRadius={baseSize / 4}
          outerRadius={baseSize / 2}
          fill={shouldFill ? fillColor || color : undefined}
          opacity={shouldFill ? opacity * fillOpacity : opacity}
          {...commonProps}
        />
      );
    }

    case 'triangle': {
      const halfWidth = actualWidth / 2;
      const halfHeight = actualHeight / 2;
      return (
        <Line
          key={id}
          points={[0, -halfHeight, -halfWidth, halfHeight, halfWidth, halfHeight]}
          closed
          fill={shouldFill ? fillColor || color : undefined}
          opacity={shouldFill ? opacity * fillOpacity : opacity}
          {...commonProps}
        />
      );
    }

    case 'hexagon': {
      const halfWidth = actualWidth / 2;
      const halfHeight = actualHeight / 2;
      const points = Array.from({ length: 6 }).flatMap((_, i) => {
        const angle = (Math.PI / 3) * i;
        return [halfWidth * Math.cos(angle), halfHeight * Math.sin(angle)];
      });

      return (
        <Line
          key={id}
          points={points}
          closed
          fill={shouldFill ? fillColor || color : undefined}
          opacity={shouldFill ? opacity * fillOpacity : opacity}
          {...commonProps}
        />
      );
    }

    case 'polygon': {
      const isEraser = shape.tool === 'eraser';
      return (
        <Line
          key={id}
          closed
          points={shape.points || []}
          fill={shape.color}
          opacity={shouldFill ? shape.opacity * (shape.fillOpacity || 1) : shape.opacity}
          globalCompositeOperation={isEraser ? 'destination-out' : 'source-over'}
          listening={false}
          // Apply smoothness to fountain pen polygons
          tension={shape.penType === 'fountain' ? (penSmoothingValue / 100) * 0.3 : 0}
        />
      );
    }

    case 'line': {
      if (Array.isArray(shape.points)) {
        const style = penStyles[shape.penType || 'ballpoint'];
        const isEraser = shape.tool === 'eraser';
        const hardnessVal = hardness ?? 1;

        // Calculate tension based on smoothness slider and pen type
        const tension = (penSmoothingValue / 100) * (style.tensionFactor ?? 1);

        return (
          <Line
            key={id}
            points={shape.points}
            stroke={shape.strokeColor || shape.color}
            strokeWidth={(shape.strokeWidth || shape.size || 2) * (style.strokeWidthMultiplier || 1)}
            strokeScaleEnabled={true}
            lineCap={style.lineCap}
            lineJoin={style.lineJoin}
            tension={tension}
            opacity={(shape.opacity ?? 1) * (style.baseOpacity ?? 1) * (isEraser ? hardnessVal : 1)}
            globalCompositeOperation={isEraser ? 'destination-out' : 'source-over'}
            listening={false}
          />
        );
      } else {
        // Draw a regular line with proper bounding box
        // Calculate line endpoints based on width and height
        const halfWidth = actualWidth / 2;
        const halfHeight = actualHeight / 2;

        // Create line points from center to create proper bounding box
        const linePoints = [-halfWidth, -halfHeight, halfWidth, halfHeight];

        return (
          <Line
            key={id}
            {...commonProps}
            points={linePoints}
            stroke={shape.strokeColor || shape.color}
            strokeWidth={shape.strokeWidth || shape.size || 2}
            strokeScaleEnabled={false}
            opacity={shape.opacity}
            lineCap="round"
            lineJoin="round"
          />
        );
      }
    }

    default:
      return null;
  }
};
