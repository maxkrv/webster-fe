import { Circle, Square, Star } from 'lucide-react';
import { useState } from 'react';

import { ColorPicker } from '../../../../shared/components/common/color-picker';
import { EnhancedSlider } from '../../../../shared/components/common/enhanced-slider';
import { Button } from '../../../../shared/components/ui/button';
import { Separator } from '../../../../shared/components/ui/separator';
import { cn } from '../../../../shared/lib/utils';

const BRUSH_TYPES = [
  {
    name: 'Round',
    icon: <Circle />
  },
  {
    name: 'Square',
    icon: <Square />
  },
  {
    name: 'Star',
    icon: <Star />
  }
];
export const BrushOptions = () => {
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushType, setBrushType] = useState('round');

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Brush Type</h3>
        <div className="grid grid-cols-3 gap-2">
          {BRUSH_TYPES.map((brush) => (
            <Button
              key={brush.name}
              variant={brushType === brush.name.toLowerCase() ? 'default' : 'outline'}
              className={cn(`flex aspect-square p-2 h-auto rounded-xl transition-all flex-col`)}
              onClick={() => setBrushType(brush.name.toLowerCase())}>
              {brush.icon}
              <span className="mt-1 text-xsxx">{brush.name}</span>
            </Button>
          ))}
        </div>
      </div>
      <Separator />
      <div>
        <h3 className="mb-3 text-sm font-medium text-foreground">Brush Size</h3>
        <EnhancedSlider
          defaultValue={[24]}
          max={100}
          step={1}
          displayFormat={{ type: 'size', labels: ['XS', 'S', 'M', 'L', 'XL'] }}
          labels={{
            min: 'Small',
            mid: 'Medium',
            max: 'Large'
          }}
        />
      </div>
      <Separator />
      <div>
        <h3 className="mb-3 text-sm font-medium text-foreground">Opacity</h3>
        <EnhancedSlider
          defaultValue={[100]}
          max={100}
          step={1}
          displayFormat={{ type: 'percentage' }}
          labels={{
            min: '0%',
            max: '100%'
          }}
        />
      </div>
      <Separator />
      <div>
        <h3 className="mb-3 text-sm font-medium text-foreground">Color</h3>
        <ColorPicker value={brushColor} onChange={setBrushColor} />
      </div>
    </div>
  );
};
