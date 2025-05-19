import { EnhancedSlider } from '../../../../shared/components/common/enhanced-slider';
import { Button } from '../../../../shared/components/ui/button';
import { Separator } from '../../../../shared/components/ui/separator';

export const ImageOptions = () => {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Image Source</h3>
        <Button variant="outline" size="sm" className="w-full rounded-full">
          Upload Image
        </Button>
        <Button variant="outline" size="sm" className="w-full rounded-full">
          Paste from URL
        </Button>
      </div>
      <Separator />
      <div>
        <h3 className="mb-3 font-medium text-foreground">Image Options</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Crop Image</span>
            <Button variant="outline" size="sm" className="rounded-full min-w-20">
              Crop
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Resize Image</span>
            <Button variant="outline" size="sm" className="rounded-full min-w-20  ">
              Resize
            </Button>
          </div>
        </div>
      </div>
      <Separator />
      <div>
        <h3 className="mb-3  font-medium text-foreground">Opacity</h3>
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
    </div>
  );
};
