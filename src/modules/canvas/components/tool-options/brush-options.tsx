import { Circle, Square, Star } from 'lucide-react';
import { useCallback } from 'react';

import { ColorPicker } from '../../../../shared/components/common/color-picker';
import { EnhancedSlider } from '../../../../shared/components/common/enhanced-slider';
import { Button } from '../../../../shared/components/ui/button';
import { Separator } from '../../../../shared/components/ui/separator';
import { cn } from '../../../../shared/lib/utils';
import { useToolOptionsStore } from '../../hooks/tool-optios-store';

type BrushType = 'round' | 'square' | 'star';

const BRUSH_TYPES: { name: string; icon: JSX.Element }[] = [
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
  const brushType = useToolOptionsStore((s) => s.brush.brushType);
  const brushSize = useToolOptionsStore((s) => s.brush.brushSize);
  const brushOpacity = useToolOptionsStore((s) => s.brush.brushOpacity);
  const brushColor = useToolOptionsStore((s) => s.brush.brushColor);
  const brushSpacing = useToolOptionsStore((s) => s.brush.brushSpacing);
  const setToolOptions = useToolOptionsStore((s) => s.setToolOptions);

  const handleBrushTypeChange = useCallback(
    (type: BrushType) => {
      setToolOptions('brush', { brushType: type });
    },
    [setToolOptions]
  );

  const handleBrushSizeChange = useCallback(
    ([value]: [number]) => {
      setToolOptions('brush', { brushSize: value });
    },
    [setToolOptions]
  );

  const handleBrushOpacityChange = useCallback(
    ([value]: [number]) => {
      setToolOptions('brush', { brushOpacity: value / 100 });
    },
    [setToolOptions]
  );

  const handleBrushColorChange = useCallback(
    (color: string) => {
      setToolOptions('brush', { brushColor: color });
    },
    [setToolOptions]
  );

  const handleBrushSpacingChange = useCallback(
    ([value]: [number]) => {
      setToolOptions('brush', { brushSpacing: value });
    },
    [setToolOptions]
  );

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Brush Type</h3>
        <div className="grid grid-cols-3 gap-2">
          {BRUSH_TYPES.map((brushOption) => (
            <Button
              key={brushOption.name}
              onClick={() => handleBrushTypeChange(brushOption.name.toLowerCase() as BrushType)}
              className={cn(`flex aspect-square p-2 h-auto rounded-xl transition-all flex-col`)}
              variant={brushType === brushOption.name.toLowerCase() ? 'default' : 'outline'}>
              {brushOption.icon}
              <span className="mt-1 text-xsxx">{brushOption.name}</span>
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="mb-3 text-sm font-medium text-foreground">Brush Size</h3>
        <EnhancedSlider
          value={[brushSize]}
          min={10}
          max={100}
          step={1}
          displayFormat={{ type: 'size', labels: ['XS', 'S', 'M', 'L', 'XL'] }}
          labels={{
            min: 'Small',
            mid: 'Medium',
            max: 'Large'
          }}
          onValueChange={handleBrushSizeChange}
        />
      </div>

      <Separator />

      <div>
        <h3 className="mb-3 text-sm font-medium text-foreground">Opacity</h3>
        <EnhancedSlider
          value={[brushOpacity * 100]}
          min={0.05 * 100}
          max={100}
          step={1}
          displayFormat={{ type: 'percentage' }}
          labels={{
            min: '0%',
            max: '100%'
          }}
          onValueChange={handleBrushOpacityChange}
        />
      </div>

      <Separator />

      <div>
        <h3 className="mb-3 text-sm font-medium text-foreground">Brush Spacing</h3>
        <EnhancedSlider
          value={[brushSpacing]}
          min={1}
          max={100}
          step={1}
          displayFormat={{ type: 'size', labels: ['T', 'N', 'W'] }}
          labels={{
            min: '1',
            mid: '50',
            max: '100'
          }}
          onValueChange={handleBrushSpacingChange}
        />
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-foreground">Color</h3>
        <ColorPicker value={brushColor} onChange={handleBrushColorChange} />
      </div>
    </div>
  );
};
