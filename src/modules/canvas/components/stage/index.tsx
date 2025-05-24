import Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { useRef, useState } from 'react';
import { Layer, Rect, Stage, Transformer } from 'react-konva';

import { useCanvasStore } from '../../../../shared/store/canvas-store';
import { useCanvasContext } from '../../hooks/use-canvas-context';
import { usePanMode } from '../../hooks/use-pan-mode';
import { useStageContainerResize } from '../../hooks/use-stage-resize';
import { useStageZoom } from '../../hooks/use-stage-zoom';
import { StageGrid } from './stage-grid';

export const CanvasStage = () => {
  const { width, height, background, scale, opacity } = useCanvasStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const { stageRef } = useCanvasContext();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const { isPanMode } = usePanMode();
  const { handleDragStart, handleDragEnd, handleDragMove, handleWheel } = useStageZoom({
    setPosition,
    containerRef,
    position
  });

  useStageContainerResize({
    setPosition,
    setStageSize,
    containerRef
  });

  const handleStageClick = (e: KonvaEventObject<MouseEvent>) => {
    if (e.target === e.currentTarget) {
      setSelectedId(null);
    }
  };

  if (stageSize.width <= 0 || stageSize.height <= 0) {
    return (
      <div
        ref={containerRef}
        className="relative flex flex-col items-center justify-center w-full h-full overflow-hidden">
        <div className="text-muted-foreground">Loading canvas...</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center w-full h-full overflow-hidden bg-muted/20"
      style={{ cursor: isPanMode ? 'grab' : 'default' }}>
      <div className="absolute inset-0 overflow-hidden">
        <Stage
          ref={stageRef}
          width={stageSize.width}
          height={stageSize.height}
          onWheel={handleWheel}
          draggable={isPanMode}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragMove={handleDragMove}
          x={position.x}
          y={position.y}
          scale={{ x: scale, y: scale }}
          onClick={handleStageClick}
          className="canvas-stage">
          <Layer>
            <Rect
              x={0}
              y={0}
              width={width}
              height={height}
              fill={background}
              stroke="#ddd"
              strokeWidth={1}
              shadowColor="rgba(0,0,0,0.1)"
              shadowBlur={5}
              shadowOffset={{ x: 0, y: 0 }}
              shadowOpacity={0.5}
              opacity={opacity}
            />

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

          <StageGrid />
        </Stage>
      </div>

      {isPanMode && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-background/80 backdrop-blur-sm rounded-md px-3 py-1 text-xs text-muted-foreground">
          Pan Mode (Space)
        </div>
      )}
    </div>
  );
};
