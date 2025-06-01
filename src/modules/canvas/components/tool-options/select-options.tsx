'use client';

import { Circle, Square, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Label } from '../../../../shared/components/ui/label';
import { Separator } from '../../../../shared/components/ui/separator';
import { useShapesStore } from '../../hooks/shapes-store';

export function SelectOptions() {
  const [selectionMode, setSelectionMode] = useState('rectangle');
  const { selectedShapeIds, clearSelection, updateShape, setShapes, shapes } = useShapesStore();

  // Local state for transform inputs
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  // Use a ref to track if we're currently updating from selection change
  const updatingFromSelection = useRef(false);

  // Update local state when selection changes
  useEffect(() => {
    if (updatingFromSelection.current) return;

    if (selectedShapeIds.length === 1) {
      updatingFromSelection.current = true;

      const shape = shapes.find((s) => s.id === selectedShapeIds[0]);
      if (shape) {
        setX(shape.x);
        setY(shape.y);
        setWidth(shape.width || shape.size || 0);
        setHeight(shape.height || shape.size || 0);
      }

      setTimeout(() => {
        updatingFromSelection.current = false;
      }, 0);
    }
  }, [selectedShapeIds, shapes]);

  const handleDeleteSelected = useCallback(() => {
    if (selectedShapeIds.length > 0) {
      setShapes(shapes.filter((shape) => !selectedShapeIds.includes(shape.id)));
      clearSelection();
    }
  }, [selectedShapeIds, setShapes, shapes, clearSelection]);

  const handleUpdatePosition = useCallback(
    (id: string, field: string, value: number) => {
      updateShape(id, { [field]: value });
    },
    [updateShape]
  );

  const hasSelection = selectedShapeIds.length > 0;
  const singleSelection = selectedShapeIds.length === 1;
  const selectedId = singleSelection ? selectedShapeIds[0] : null;

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Selection Mode</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={selectionMode === 'rectangle' ? 'default' : 'outline'}
            size="sm"
            className="justify-start rounded-full"
            onClick={() => setSelectionMode('rectangle')}>
            <Square className="mr-2 h-4 w-4" /> Rectangle
          </Button>
          <Button
            variant={selectionMode === 'ellipse' ? 'default' : 'outline'}
            size="sm"
            className="justify-start rounded-full"
            onClick={() => setSelectionMode('ellipse')}>
            <Circle className="mr-2 h-4 w-4" /> Ellipse
          </Button>
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Selection Info</h3>
        <div className="text-sm text-muted-foreground">
          {hasSelection ? (
            <span>
              {selectedShapeIds.length} shape{selectedShapeIds.length > 1 ? 's' : ''} selected
            </span>
          ) : (
            <span>No shapes selected</span>
          )}
        </div>
      </div>

      {singleSelection && selectedId && (
        <>
          <Separator />
          <div>
            <h3 className="mb-3 text-sm font-medium text-foreground">Transform</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="x-input" className="text-xs text-muted-foreground mb-1">
                    X Position
                  </Label>
                  <Input
                    type="number"
                    id="x-input"
                    value={x}
                    onChange={(e) => setX(Number(e.target.value))}
                    onBlur={() => handleUpdatePosition(selectedId, 'x', x)}
                  />
                </div>
                <div>
                  <Label htmlFor="y-input" className="text-xs text-muted-foreground mb-1">
                    Y Position
                  </Label>
                  <Input
                    type="number"
                    id="y-input"
                    value={y}
                    onChange={(e) => setY(Number(e.target.value))}
                    onBlur={() => handleUpdatePosition(selectedId, 'y', y)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="width-input" className="text-xs text-muted-foreground mb-1">
                    Width
                  </Label>
                  <Input
                    type="number"
                    id="width-input"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    onBlur={() => handleUpdatePosition(selectedId, 'width', width)}
                  />
                </div>
                <div>
                  <Label htmlFor="height-input" className="text-xs text-muted-foreground mb-1">
                    Height
                  </Label>
                  <Input
                    type="number"
                    id="height-input"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    onBlur={() => handleUpdatePosition(selectedId, 'height', height)}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <Separator />

      <div>
        <h3 className="mb-3 text-sm font-medium text-foreground">Actions</h3>
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full rounded-full shadow-sm hover:shadow-md transition-all"
            onClick={clearSelection}
            disabled={!hasSelection}>
            Clear Selection
          </Button>

          <Button
            variant="destructive"
            size="sm"
            className="w-full rounded-full shadow-sm hover:shadow-md transition-all"
            onClick={handleDeleteSelected}
            disabled={!hasSelection}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Selected
          </Button>
        </div>
      </div>

      {!hasSelection && (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">
            Click on shapes to select them, or drag to create a selection box.
          </p>
          <p className="text-xs text-muted-foreground mt-1">Hold Shift to select multiple shapes.</p>
        </div>
      )}
    </div>
  );
}
