import { useState } from 'react';

import { ColorPicker } from '../../../../shared/components/common/color-picker';
import { EnhancedSlider } from '../../../../shared/components/common/enhanced-slider';
import { Separator } from '../../../../shared/components/ui/separator';
import { Switch } from '../../../../shared/components/ui/switch';

export const PointerOptions = () => {
  const [pointerColor, setPointerColor] = useState('#FF5555');
  const [showTrail, setShowTrail] = useState(true);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Laser Pointer Options</h3>
        <div className="space-y-3">
          <div>
            <h4 className="mb-2 text-xs font-medium text-foreground">Color</h4>
            <ColorPicker value={pointerColor} onChange={setPointerColor} />
          </div>
        </div>
      </div>
      <Separator />
      <div>
        <h3 className="mb-3 text-sm font-medium text-foreground">Size</h3>
        <EnhancedSlider
          defaultValue={[8]}
          max={20}
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
        <h3 className="mb-3 text-sm font-medium text-foreground">Trail</h3>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-foreground">Show Trail</span>
          <Switch checked={showTrail} onCheckedChange={setShowTrail} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-2 block">Trail Length</label>
          <EnhancedSlider
            defaultValue={[50]}
            max={100}
            step={1}
            displayFormat={{ type: 'size', labels: ['S', 'M', 'L'] }}
            labels={{
              min: 'Short',
              mid: 'Medium',
              max: 'Long'
            }}
          />
        </div>
      </div>
    </div>
  );
};
