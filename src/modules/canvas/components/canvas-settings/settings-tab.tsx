import { LayoutTemplate } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { ColorPicker } from '@/shared/components/common/color-picker';
import { ConstrainProporions } from '@/shared/components/common/constrain-proportions';
import { EnhancedSlider } from '@/shared/components/common/enhanced-slider';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Separator } from '@/shared/components/ui/separator';
import { Switch } from '@/shared/components/ui/switch';
import { useCanvasStore } from '@/shared/store/canvas-store';

import { DimensionSelector } from '../dimension-selector';

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
  const { maxSize, minSize, width, height, setDimensions, opacity, setOpacity, showGrid, setShowGrid } =
    useCanvasStore();
  const [widthInput, setWidthInput] = useState(width.toString());
  const [heightInput, setHeightInput] = useState(height.toString());

  const aspectRatioRef = useRef(width / height);

  useEffect(() => {
    setWidthInput((prev) => {
      const parsed = parseInt(prev, 10);
      return parsed === width ? prev : width.toString();
    });
  }, [width]);

  useEffect(() => {
    setHeightInput((prev) => {
      const parsed = parseInt(prev, 10);
      return parsed === height ? prev : height.toString();
    });
  }, [height]);

  useEffect(() => {
    if (!constrainProportions) {
      const w = Number(widthInput);
      const h = Number(heightInput);
      if (w > 0 && h > 0) {
        aspectRatioRef.current = w / h;
      }
    }
  }, [widthInput, heightInput, constrainProportions]);

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWidthInput(e.target.value);
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeightInput(e.target.value);
  };

  const handleWithBlur = () => {
    let newWidth = Number(widthInput);

    if (isNaN(newWidth)) {
      setWidthInput(width.toString());
      return;
    }

    if (newWidth < minSize) newWidth = minSize;
    if (newWidth > maxSize) newWidth = maxSize;

    setWidthInput(newWidth.toString());

    if (constrainProportions) {
      const newHeight = Math.round(newWidth / aspectRatioRef.current);
      setHeightInput(newHeight.toString());
      setDimensions(newWidth, newHeight);
    } else {
      setDimensions(newWidth, Number(heightInput));
    }
  };

  const handleHeightBlur = () => {
    let newHeight = Number(heightInput);

    if (isNaN(newHeight)) {
      setHeightInput(height.toString());
      return;
    }

    if (newHeight < minSize) newHeight = minSize;
    if (newHeight > maxSize) newHeight = maxSize;

    setHeightInput(newHeight.toString());

    if (constrainProportions) {
      const newWidth = Math.round(newHeight * aspectRatioRef.current);
      setWidthInput(newWidth.toString());
      setDimensions(newWidth, newHeight);
    } else {
      setDimensions(Number(widthInput), newHeight);
    }
  };

  return (
    <>
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Dimensions</h3>
        <div className="flex items-center gap-4">
          <div className="grow">
            <Label htmlFor="width-input" className="text-xs text-muted-foreground mb-1">
              Width
            </Label>
            <div className="flex items-center gap-2 relative w-full">
              <Input
                type="number"
                id="width0input"
                defaultValue="1920"
                className="w-21"
                value={widthInput}
                min={10}
                max={10000}
                iconPosition="right"
                icon={<span className="text-xs text-muted-foreground right-0 p-2">px</span>}
                onChange={handleWidthChange}
                onBlur={handleWithBlur}
              />
            </div>
          </div>
          <ConstrainProporions checked={constrainProportions} onCheckedChange={setConstrainProportions} />
          <div className="grow">
            <Label htmlFor="height-input" className="text-xs text-muted-foreground mb-1">
              Height
            </Label>
            <div className="flex items-center gap-2 relative w-full ">
              <Input
                type="number"
                id="height-input"
                defaultValue="1080"
                className="w-21"
                value={heightInput}
                min={10}
                max={10000}
                iconPosition="right"
                icon={<span className="text-xs text-muted-foreground right-0 p-2">px</span>}
                onChange={handleHeightChange}
                onBlur={handleHeightBlur}
              />
            </div>
          </div>
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
          value={[Math.round(opacity * 100)]}
          onValueChange={([value]) => setOpacity(value / 100)}
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
          <Switch className="rounded-full" checked={showGrid} onCheckedChange={setShowGrid} />
        </div>
      </div>
    </>
  );
};
