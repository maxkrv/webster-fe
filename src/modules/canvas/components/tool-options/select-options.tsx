import { Circle, Square } from 'lucide-react';
import { useState } from 'react';

import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Label } from '../../../../shared/components/ui/label';
import { Separator } from '../../../../shared/components/ui/separator';

export function SelectOptions() {
  const [selectionMode, setSelectionMode] = useState('rectangle');

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Selection Mode</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={selectionMode === 'rectangle' ? 'default' : 'outline'}
            size="sm"
            className="justify-start rounded-full"
            onClick={() => setSelectionMode('rectangle')}>
            <Square className="mr-2 h-4 w-4" /> Rectangle
          </Button>
          <Button
            variant={selectionMode === 'ellipse' ? 'default' : 'outline'}
            size="sm"
            className="justify-start rounded-full"
            onClick={() => setSelectionMode('ellipse')}>
            <Circle className="mr-2 h-4 w-4" /> Ellipse
          </Button>
        </div>
      </div>
      <Separator />
      <div>
        <h3 className="mb-3 text-sm font-medium text-foreground">Transform</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="height-input" className="text-xs text-muted-foreground mb-1">
                X Position
              </Label>
              <div className="flex items-center gap-2 relative">
                <Input
                  type="number"
                  id="height-input"
                  defaultValue="120"
                  iconPosition="right"
                  icon={<span className="text-xs text-muted-foreground right-0 p-2">px</span>}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="width-input" className="text-xs text-muted-foreground mb-1">
                Y Position
              </Label>
              <div className="flex items-center gap-2 relative">
                <Input
                  type="number"
                  id="width-input"
                  defaultValue="120"
                  iconPosition="right"
                  icon={<span className="text-xs text-muted-foreground right-0 p-2">px</span>}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="width-input" className="text-xs text-muted-foreground mb-1">
                Width
              </Label>
              <div className="flex items-center gap-2 relative">
                <Input
                  type="number"
                  id="width-input"
                  defaultValue="180"
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
                  defaultValue="70"
                  iconPosition="right"
                  icon={<span className="text-xs text-muted-foreground right-0 p-2">px</span>}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Separator />
      <div>
        <h3 className="mb-3 text-sm font-medium text-foreground">Actions</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="rounded-full shadow-sm hover:shadow-md transition-all">
            Crop Selection
          </Button>
          <Button variant="outline" size="sm" className="rounded-full shadow-sm hover:shadow-md transition-all">
            Clear Selection
          </Button>
        </div>
      </div>
    </div>
  );
}
