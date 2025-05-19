import { Circle, Hexagon, Square, Star, Triangle } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { IoAnalyticsOutline } from 'react-icons/io5';

import { ColorPicker } from '../../../../shared/components/common/color-picker';
import { EnhancedSlider } from '../../../../shared/components/common/enhanced-slider';
import { Button } from '../../../../shared/components/ui/button';
import { Separator } from '../../../../shared/components/ui/separator';
import { Switch } from '../../../../shared/components/ui/switch';
import { cn } from '../../../../shared/lib/utils';
import { Shapes, useLeftSidebarStore } from '../../../home/hooks/use-left-sidebar-store';

const SHAPES: Array<{ value: Shapes; label: string; icon: ReactNode }> = [
  { value: 'rectangle', label: 'Rectangle', icon: <Square /> },
  { value: 'circle', label: 'Circle', icon: <Circle /> },
  { value: 'triangle', label: 'Triangle', icon: <Triangle /> },
  { value: 'hexagon', label: 'Hexagon', icon: <Hexagon /> },
  { value: 'star', label: 'Star', icon: <Star /> },
  { value: 'line', label: 'Line', icon: <IoAnalyticsOutline /> }
];

export const ShapesOptions = () => {
  const [fillColor, setFillColor] = useState('#8B5CF6');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const { activeShape, setActiveShape } = useLeftSidebarStore();

  return (
    <div className="space-y-3">
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Shape Type</h3>
        <div className="grid grid-cols-3 gap-2">
          {SHAPES.map((shape) => (
            <Button
              key={shape.value}
              variant={activeShape === shape.value ? 'default' : 'outline'}
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
          <Switch defaultChecked />
        </div>
        <ColorPicker value={fillColor} onChange={setFillColor} />
      </div>
      <Separator />
      <div>
        <h3 className="mb-3 text-sm font-medium text-foreground">Stroke</h3>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-foreground">Show Stroke</span>
          <Switch defaultChecked />
        </div>
        <div className="mb-3">
          <label className="text-xs text-gray-700 mb-2 block">Width</label>
          <EnhancedSlider
            defaultValue={[2]}
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
