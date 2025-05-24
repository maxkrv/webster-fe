'use client';

import type Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Layer, Line, Rect, Stage, Transformer } from 'react-konva';

import { useDebounce } from '../../../../shared/components/ui/multi-selector';
import { useCanvasStore } from '../../../../shared/store/canvas-store';
import { useLeftSidebarStore } from '../../../home/hooks/use-left-sidebar-store';
import { useRightSidebarStore } from '../../../home/hooks/use-right-sidebar-store';
import { useDimensionDialogStore } from '../../hooks/dimention-dialog-store';
import { useCanvasContext } from '../../hooks/use-canvas-context';

export const CanvasStage = () => {
  const { width, height, background, scale, opacity, setScale, shouldResetScale, showGrid } = useCanvasStore();
  const { showLeftSidebar } = useLeftSidebarStore();
  const { showRightSidebar } = useRightSidebarStore();
  const { setIsOpen: openDimensionSelector } = useDimensionDialogStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const { stageRef } = useCanvasContext();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isResizingRef = useRef(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  const updateSize = useCallback(() => {
    if (!containerRef.current) return;

    void containerRef.current.offsetHeight;

    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;

    if (containerWidth <= 0 || containerHeight <= 0 || width <= 0 || height <= 0) {
      return;
    }

    isResizingRef.current = true;

    const scaleX = containerWidth / width;
    const scaleY = containerHeight / height;
    const newScale = Math.min(scaleX, scaleY) * 0.8;

    setStageSize({
      width: Math.max(1, containerWidth),
      height: Math.max(1, containerHeight)
    });

    setScale(Math.max(0.1, newScale));

    setPosition({
      x: (containerWidth - width * newScale) / 2,
      y: (containerHeight - height * newScale) / 2
    });

    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }

    resizeTimeoutRef.current = setTimeout(() => {
      isResizingRef.current = false;
      if (stageRef.current) {
        stageRef.current.batchDraw();
      }
    }, 150);
  }, [width, height, setScale]);

  const debouncedUpdateSize = useDebounce(updateSize, 100);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    updateSize();

    const resizeObserver = new ResizeObserver(() => {
      if (!isResizingRef.current && !signal.aborted) {
        debouncedUpdateSize();
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    const handleResize = () => {
      if (!isResizingRef.current && !signal.aborted) {
        debouncedUpdateSize();
      }
    };

    window.addEventListener('resize', handleResize, { signal });

    return () => {
      abortController.abort();
      resizeObserver.disconnect();
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [updateSize, debouncedUpdateSize]);

  useEffect(() => {
    if (!containerRef.current) return;

    const abortController = new AbortController();
    const signal = abortController.signal;

    const observer = new MutationObserver((mutations) => {
      const mightAffectLayout = mutations.some(
        (mutation) =>
          mutation.type === 'attributes' ||
          mutation.type === 'childList' ||
          (mutation.type === 'characterData' && mutation.target.parentElement === containerRef.current)
      );

      if (mightAffectLayout && !isResizingRef.current && !signal.aborted) {
        setTimeout(() => {
          if (!signal.aborted) {
            updateSize();
          }
        }, 100);
      }
    });

    observer.observe(containerRef.current, {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true
    });

    if (containerRef.current.parentElement) {
      observer.observe(containerRef.current.parentElement, {
        attributes: true,
        childList: false
      });
    }

    return () => {
      abortController.abort();
      observer.disconnect();
    };
  }, [updateSize]);

  useEffect(() => {
    const abortController = new AbortController();

    if (stageRef.current) {
      stageRef.current.batchDraw();
    }

    const timer = setTimeout(() => {
      if (!isResizingRef.current && !abortController.signal.aborted) {
        if (containerRef.current) {
          const containerWidth = containerRef.current.offsetWidth;
          const containerHeight = containerRef.current.offsetHeight;

          if (containerWidth > 0 && containerHeight > 0) {
            updateSize();

            setTimeout(() => {
              if (stageRef.current && !abortController.signal.aborted) {
                stageRef.current.batchDraw();
              }
            }, 50);
          }
        }
      }
    }, 250);

    return () => {
      abortController.abort();
      clearTimeout(timer);
    };
  }, [showLeftSidebar, showRightSidebar, updateSize]);

  useEffect(() => {
    const abortController = new AbortController();

    const timer = setTimeout(() => {
      if (!abortController.signal.aborted) {
        updateSize();
      }
    }, 50);

    return () => {
      abortController.abort();
      clearTimeout(timer);
    };
  }, [width, height, updateSize]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        setIsSpacePressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown, { signal });
    window.addEventListener('keyup', handleKeyUp, { signal });

    return () => {
      abortController.abort();
    };
  }, []);

  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    if (!e.evt.ctrlKey && e.evt.button !== 1) {
      return;
    }

    e.evt.preventDefault();

    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = scale;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - position.x) / oldScale,
      y: (pointer.y - position.y) / oldScale
    };

    const scaleBy = 1.1;
    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    const limitedScale = Math.max(0.1, Math.min(newScale, 5));

    const newPos = {
      x: pointer.x - mousePointTo.x * limitedScale,
      y: pointer.y - mousePointTo.y * limitedScale
    };

    setScale(limitedScale);
    setPosition(newPos);
  };

  const resetView = useCallback(() => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;

    const scaleX = containerWidth / width;
    const scaleY = containerHeight / height;
    const newScale = Math.min(scaleX, scaleY) * 0.8;

    setScale(newScale);
    setPosition({
      x: (containerWidth - width * newScale) / 2,
      y: (containerHeight - height * newScale) / 2
    });
  }, [width, height, setScale]);

  useEffect(() => {
    resetView();
  }, [shouldResetScale, resetView]);
  useHotkeys('ctrl+0', resetView, [resetView]);
  useHotkeys('ctrl+d', () => openDimensionSelector(true), [openDimensionSelector]);

  const handleStageClick = (e: KonvaEventObject<MouseEvent>) => {
    if (e.target === e.currentTarget) {
      setSelectedId(null);
    }
  };

  const handleDragStart = () => {
    if (!isSpacePressed) return;
    document.body.style.cursor = 'grabbing';
  };

  const handleDragEnd = () => {
    document.body.style.cursor = 'default';
  };

  const handleDragMove = (e: KonvaEventObject<DragEvent>) => {
    if (!isSpacePressed) return;
    setPosition({
      x: e.target.x(),
      y: e.target.y()
    });
  };

  useLayoutEffect(() => {
    const abortController = new AbortController();

    const timer = setTimeout(() => {
      if (!abortController.signal.aborted && stageRef.current) {
        stageRef.current.batchDraw();
      }
    }, 100);

    return () => {
      abortController.abort();
      clearTimeout(timer);
    };
  }, []);

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
      style={{ cursor: isSpacePressed ? 'grab' : 'default' }}>
      <div className="absolute inset-0 overflow-hidden">
        <Stage
          ref={stageRef}
          width={stageSize.width}
          height={stageSize.height}
          onWheel={handleWheel}
          draggable={isSpacePressed}
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

          {showGrid && (
            <Layer listening={false}>
              {Array.from({ length: Math.ceil(width / 20) }, (_, i) => (
                <Line
                  key={`v-${i}`}
                  points={[i * 20, 0, i * 20, height]}
                  stroke="#FF0000"
                  strokeWidth={0.5}
                  opacity={0.4}
                />
              ))}
              {Array.from({ length: Math.ceil(height / 20) }, (_, i) => (
                <Line
                  key={`h-${i}`}
                  points={[0, i * 20, width, i * 20]}
                  stroke="#FF0000"
                  strokeWidth={0.5}
                  opacity={0.4}
                />
              ))}
            </Layer>
          )}
        </Stage>
      </div>

      {isSpacePressed && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-background/80 backdrop-blur-sm rounded-md px-3 py-1 text-xs text-muted-foreground">
          Pan Mode (Space)
        </div>
      )}
    </div>
  );
};
