import { Download } from 'lucide-react';

import { EnhancedSlider } from '@/shared/components/common/enhanced-slider';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Separator } from '@/shared/components/ui/separator';

const EXPORT_FORMATS = ['png', 'jpg'];

interface ExportTabProps {
  exportFormat: string;
  setExportFormat: (format: string) => void;
}

export const ExportTab = ({ exportFormat, setExportFormat }: ExportTabProps) => {
  return (
    <>
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Format</h3>
        <div className="grid grid-cols-2 gap-2">
          {EXPORT_FORMATS.map((format) => (
            <Button
              key={format}
              variant={exportFormat === format ? 'default' : 'outline'}
              size="sm"
              className="w-full rounded-full shadow-sm hover:shadow-md transition-all"
              onClick={() => setExportFormat(format)}>
              {format.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>

      <Separator orientation="horizontal" />

      <div>
        <h3 className="mb-3 text-sm font-medium text-foreground">Quality</h3>
        <EnhancedSlider
          defaultValue={[90]}
          max={100}
          step={1}
          displayFormat={{
            type: 'custom',
            formatter: (value) => `${value}`
          }}
          labels={{ min: 'Low', mid: 'Medium', max: 'High' }}
        />
      </div>

      <Separator orientation="horizontal" />

      <div>
        <h3 className="mb-3 text-sm font-medium text-foreground">Size</h3>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <Label htmlFor="width-input" className="text-xs text-muted-foreground mb-1">
              Width
            </Label>
            <div className="flex items-center gap-2 relative">
              <Input
                type="number"
                id="width-input"
                defaultValue="1920"
                iconPosition="right"
                icon={<span className="text-xs text-muted-foreground right-0 p-2">px</span>}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="height-input" className="text-xs text-muted-foreground mb-1">
              Height
            </Label>
            <div className="flex items-center gap-2 relative">
              <Input
                type="number"
                id="height-input"
                defaultValue="1080"
                iconPosition="right"
                icon={<span className="text-xs text-muted-foreground right-0 p-2">px</span>}
              />
            </div>
          </div>
        </div>

        <Button variant="outline" size="sm" className="w-full rounded-full shadow-sm hover:shadow-md transition-all">
          Scale to Original Size
        </Button>
      </div>
      <Separator orientation="horizontal" />
      <Button className="w-full">
        <Download className="mr-2 h-4 w-4" /> Export Image
      </Button>
    </>
  );
};
