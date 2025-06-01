'use client';

import { Circle, Hexagon, Square, Star, Triangle } from 'lucide-react';
import type { ReactNode } from 'react';
import { IoAnalyticsOutline } from 'react-icons/io5';

import { ColorPicker } from '../../../../shared/components/common/color-picker';
import { EnhancedSlider } from '../../../../shared/components/common/enhanced-slider';
import { Button } from '../../../../shared/components/ui/button';
import { Separator } from '../../../../shared/components/ui/separator';
import { Switch } from '../../../../shared/components/ui/switch';
import { cn } from '../../../../shared/lib/utils';
import { type Shapes, useToolOptionsStore } from '../../hooks/tool-optios-store';

const SHAPES: Array<{ value: Shapes; label: string; icon: ReactNode }> = [
  { value: 'rectangle', label: 'Rectangle', icon: <Square /> },
  { value: 'circle', label: 'Circle', icon: <Circle /> },
  { value: 'triangle', label: 'Triangle', icon: <Triangle /> },
  { value: 'hexagon', label: 'Hexagon', icon: <Hexagon /> },
  { value: 'star', label: 'Star', icon: <Star /> },
  { value: 'line', label: 'Line', icon: <IoAnalyticsOutline /> }
];

export const ShapesOptions = () => {
  const { shapeType, fillColor, strokeColor, strokeWidth, showStroke, shouldFill } = useToolOptionsStore(
    (s) => s.shape
  );
  const { setToolOptions } = useToolOptionsStore();

  const setActiveShape = (value: Shapes) => {
    setToolOptions('shape', { shapeType: value });
  };
  const setFillColor = (color: string) => {
    setToolOptions('shape', { fillColor: color });
  };
  const setStrokeColor = (color: string) => {
    setToolOptions('shape', { strokeColor: color });
  };

  return (
    <div className="space-y-3">
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Shape Type</h3>
        <div className="grid grid-cols-3 gap-2">
          {SHAPES.map((shape) => (
            <Button
              key={shape.value}
              variant={shapeType === shape.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveShape(shape.value)}
              className={cn(`flex aspect-square p-2 h-auto rounded-xl transition-all flex-col`)}>
              {shape.icon}
              <span className="text-xs">{shape.label}</span>
            </Button>
          ))}
        </div>
      </div>
      <Separator />
      <div>
        <h3 className="mb-3 text-sm font-medium text-foreground">Fill</h3>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-foreground">Fill Shape</span>
          <Switch
            defaultChecked
            checked={shouldFill}
            onCheckedChange={(checked) => setToolOptions('shape', { shouldFill: checked })}
          />
        </div>
        <ColorPicker value={fillColor} onChange={setFillColor} />
      </div>
      <Separator />
      <div>
        <h3 className="mb-3 text-sm font-medium text-foreground">Stroke</h3>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-foreground">Show Stroke</span>
          <Switch
            defaultChecked
            checked={showStroke}
            onCheckedChange={(checked) => setToolOptions('shape', { showStroke: checked })}
          />
        </div>
        <div className="mb-3">
          <label className="text-xs text-gray-700 mb-2 block">Width</label>
          <EnhancedSlider
            defaultValue={[2]}
            value={[strokeWidth]}
            onValueChange={(value) => setToolOptions('shape', { strokeWidth: value[0] })}
            max={20}
            step={1}
            displayFormat={{ type: 'size', labels: ['T', 'M', 'B'] }}
            labels={{
              min: 'Thin',
              mid: 'Medium',
              max: 'Bold'
            }}
          />
        </div>
        <ColorPicker value={strokeColor} onChange={setStrokeColor} />
      </div>
    </div>
  );
};
