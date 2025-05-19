import { useState } from 'react';
import { FaPen, FaPenNib } from 'react-icons/fa6';
import { PiMarkerCircleBold } from 'react-icons/pi';

import { ColorPicker } from '../../../../shared/components/common/color-picker';
import { EnhancedSlider } from '../../../../shared/components/common/enhanced-slider';
import { Button } from '../../../../shared/components/ui/button';
import { Separator } from '../../../../shared/components/ui/separator';
import { cn } from '../../../../shared/lib/utils';

const PEN_TYPES = [
  { value: 'ballpoint', label: 'Ballpoint', icon: <FaPen /> },
  { value: 'fountain', label: 'Fountain', icon: <FaPenNib /> },
  { value: 'marker', label: 'Marker', icon: <PiMarkerCircleBold /> }
];
export const PenOptions = () => {
  const [penColor, setPenColor] = useState('#000000');
  const [penType, setPenType] = useState('ballpoint');

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Pen Type</h3>
        <div className="grid grid-cols-3 gap-2">
          {PEN_TYPES.map((pen) => (
            <Button
              key={pen.value}
              variant={penType === pen.value ? 'default' : 'outline'}
              className={cn(`flex aspect-square p-2 h-auto rounded-xl transition-all flex-col`)}
              onClick={() => setPenType(pen.value)}>
              {pen.icon}
              <span className="mt-1 text-xs">{pen.label}</span>
            </Button>
          ))}
        </div>
      </div>
      <Separator />
      <div>
        <h3 className="mb-3 text-sm font-medium text-foreground">Line Width</h3>
        <EnhancedSlider
          defaultValue={[2]}
          max={20}
          step={1}
          displayFormat={{ type: 'size', labels: ['XS', 'S', 'M', 'L', 'XL'] }}
          labels={{
            min: 'Thin',
            mid: 'Medium',
            max: 'Thick'
          }}
        />
      </div>
      <Separator />
      <div>
        <h3 className="mb-3 text-sm font-medium text-foreground">Smoothing</h3>
        <EnhancedSlider
          defaultValue={[50]}
          max={100}
          step={1}
          displayFormat={{ type: 'size', labels: ['N', 'L', 'M', 'H'] }}
          labels={{
            min: 'None',
            mid: 'Medium',
            max: 'High'
          }}
        />
      </div>
      <Separator />
      <div>
        <h3 className="mb-3 text-sm font-medium text-foreground">Color</h3>
        <ColorPicker value={penColor} onChange={setPenColor} />
      </div>
    </div>
  );
};
