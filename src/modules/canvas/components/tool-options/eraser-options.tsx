import { useState } from 'react';
import { GrObjectGroup } from 'react-icons/gr';
import { LuEraser } from 'react-icons/lu';

import { EnhancedSlider } from '../../../../shared/components/common/enhanced-slider';
import { Button } from '../../../../shared/components/ui/button';
import { Separator } from '../../../../shared/components/ui/separator';

export const EraserOptions = () => {
  const [eraserType, setEraserType] = useState('pixel');

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Eraser Type</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={eraserType === 'pixel' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setEraserType('pixel')}>
            <LuEraser />
            Pixel
          </Button>
          <Button
            variant={eraserType === 'object' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setEraserType('object')}>
            <GrObjectGroup />
            Object
          </Button>
        </div>
      </div>
      <Separator />
      <div>
        <h3 className="mb-3 text-sm font-medium text-foreground">Eraser Size</h3>
        <EnhancedSlider
          defaultValue={[20]}
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
        <h3 className="mb-3 text-sm font-medium text-foreground">Hardness</h3>
        <EnhancedSlider
          defaultValue={[100]}
          max={100}
          step={1}
          displayFormat={{ type: 'size', labels: ['S', 'M', 'H'] }}
          labels={{
            min: 'Soft',
            mid: 'Medium',
            max: 'Hard'
          }}
        />
      </div>
      <Separator />
      <div>
        <h3 className="mb-3 text-sm font-medium text-foreground">Preview</h3>
        <div className="relative h-24 rounded-md bg-[url('/checkerboard-pattern.png')] bg-cover bg-opacity-50">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-20 w-20 rounded-full border-2 border-dashed border-primary"></div>
          </div>
        </div>
        <div className="mt-3">
          <Button variant="outline" size="sm" className="w-full rounded-full">
            Clear All
          </Button>
        </div>
      </div>
    </div>
  );
};
