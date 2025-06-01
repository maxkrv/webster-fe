'use client';

import Konva from 'konva';
import { Ellipse, Image, Line, Rect, Star, Text } from 'react-konva';

import type { Shape } from '../../hooks/shapes-store';

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
    lineCap: 'square' as const,
    lineJoin: 'round' as const,
    tensionFactor: 0,
    baseOpacity: 0.5,
    strokeWidthMultiplier: 1.5
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
    fontStyle,
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
    cropHeight
  } = shape;

  // Calculate actual dimensions
  const actualWidth = width || size;
  const actualHeight = height || size;

  // Selection highlight properties
  const selectionStroke = isSelected ? '#007AFF' : undefined;
  const selectionStrokeWidth = isSelected ? 2 : 0;
  const selectionDash = isSelected ? [5, 5] : undefined;

  // Keep stroke width consistent regardless of scale
  const adjustedStrokeWidth = showStroke ? (strokeWidth || 2) / Math.max(scaleX, scaleY) : 0;
  const adjustedSelectionStrokeWidth = selectionStrokeWidth / Math.max(scaleX, scaleY);

  const handleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Stop event propagation to prevent canvas click
    e.cancelBubble = true;

    if (onSelect) {
      onSelect(id);
    }
  };

  const commonProps = {
    id,
    onClick: handleClick,
    stroke: selectionStroke || (showStroke ? strokeColor : undefined),
    strokeWidth: adjustedSelectionStrokeWidth || adjustedStrokeWidth,
    dash: selectionDash,
    listening: true,
    draggable: isSelected,
    x,
    y,
    rotation,
    scaleX,
    scaleY
  };

  switch (type) {
    case 'image':
      if (!imageElement) {
        // Render a placeholder while image is loading
        return (
          <Rect
            key={id}
            width={actualWidth}
            height={actualHeight}
            fill="#f0f0f0"
            {...commonProps}
            stroke="#ccc"
            strokeWidth={1}
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
          opacity={opacity}
          crop={
            cropX !== undefined && cropY !== undefined && cropWidth !== undefined && cropHeight !== undefined
              ? { x: cropX, y: cropY, width: cropWidth, height: cropHeight }
              : undefined
          }
          {...commonProps}
          scaleX={(flipX ? -1 : 1) * (scaleX || 1)}
          scaleY={(flipY ? -1 : 1) * (scaleY || 1)}
          // Center the image properly
          offsetX={actualWidth / 2}
          offsetY={actualHeight / 2}
          // Add hover effect for better UX
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

    case 'text':
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
            // Double click event will be handled by the text logic hook
            e.cancelBubble = true;
          }}
          // Make text more clickable by adding some padding to the hit area
          hitStrokeWidth={Math.max(fontSize || 16, 20)}
          // Add a subtle hover effect
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
          // Add data attribute for easier selection
          attrs={{
            'data-text-id': id
          }}
        />
      );

    case 'round':
    case 'circle': {
      // Use Ellipse for circles to support different width/height
      // If width === height, it will be a perfect circle
      return (
        <Ellipse
          key={id}
          radiusX={actualWidth / 2}
          radiusY={actualHeight / 2}
          fill={shouldFill ? fillColor || color : undefined}
          opacity={opacity}
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
          opacity={opacity}
          {...commonProps}
          x={x - actualWidth / 2}
          y={y - actualHeight / 2}
        />
      );

    case 'star':
      // For stars, we use a fixed radius and let scaleX/scaleY handle deformation
      return (
        <Star
          key={id}
          numPoints={5}
          innerRadius={size / 4}
          outerRadius={size / 2}
          fill={shouldFill ? fillColor || color : undefined}
          opacity={opacity}
          {...commonProps}
        />
      );

    case 'triangle': {
      const halfWidth = actualWidth / 2;
      const halfHeight = actualHeight / 2;
      return (
        <Line
          key={id}
          points={[0, -halfHeight, -halfWidth, halfHeight, halfWidth, halfHeight]}
          closed
          fill={shouldFill ? fillColor || color : undefined}
          opacity={opacity}
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
          opacity={opacity}
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
            listening={false}
          />
        );
      } else {
        // Draw a regular line with x, y as the center and use absolute coordinates for the points
        return (
          <Line
            key={id}
            {...commonProps}
            points={[0, 0, shape.x2 ? shape.x2 - x : 0, shape.y2 ? shape.y2 - y : 0]}
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
