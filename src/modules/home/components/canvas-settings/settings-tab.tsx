import { LayoutTemplate } from 'lucide-react';

import { ColorPicker } from '@/shared/components/common/color-picker';
import { EnhancedSlider } from '@/shared/components/common/enhanced-slider';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Separator } from '@/shared/components/ui/separator';
import { Switch } from '@/shared/components/ui/switch';

import { DimensionSelector } from '../../../canvas/components/dimension-selector';

interface SettingsTabProps {
  constrainProportions: boolean;
  setConstrainProportions: (value: boolean) => void;
  background: string;
  setBackground: (value: string) => void;
}

export const SettingsTab = ({
  constrainProportions,
  setConstrainProportions,
  background,
  setBackground
}: SettingsTabProps) => {
  return (
    <>
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Dimensions</h3>
        <div className="grid grid-cols-2 gap-3">
          {['Width', 'Height'].map((label) => (
            <div key={label}>
              <Label htmlFor={`${label.toLowerCase()}-input`} className="text-xs text-muted-foreground mb-1">
                {label}
              </Label>
              <div className="flex items-center gap-2 relative">
                <Input
                  type="number"
                  id={`${label.toLowerCase()}-input`}
                  defaultValue={label === 'Width' ? '1920' : '1080'}
                  iconPosition="right"
                  icon={<span className="text-xs text-muted-foreground right-0 p-2">px</span>}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm text-foreground">Constrain Proportions</span>
          <Switch checked={constrainProportions} onCheckedChange={setConstrainProportions} className="rounded-full" />
        </div>
      </div>

      <div className="mt-2">
        <DimensionSelector onSelect={() => {}}>
          <Button variant="outline" size="sm" className="w-full rounded-full shadow-sm hover:shadow-md transition-all">
            <LayoutTemplate className="mr-2 h-4 w-4" />
            Choose from templates
          </Button>
        </DimensionSelector>
      </div>

      <Separator orientation="horizontal" />

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Background</h3>
        <ColorPicker value={background} onChange={setBackground} />
      </div>

      <Separator orientation="horizontal" />

      <div>
        <h3 className="mb-1 text-sm font-medium text-foreground">Opacity</h3>
        <EnhancedSlider
          defaultValue={[100]}
          max={100}
          step={1}
          displayFormat={{ type: 'percentage' }}
          labels={{ min: '0%', max: '100%' }}
        />
      </div>

      <Separator orientation="horizontal" />

      <div>
        <h3 className="mb-1 text-sm font-medium text-foreground">Grid</h3>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-foreground">Show Grid</span>
          <Switch className="rounded-full" />
        </div>
      </div>
    </>
  );
};
