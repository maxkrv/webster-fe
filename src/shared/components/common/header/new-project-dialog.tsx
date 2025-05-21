import { SquarePlus } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

import { DimensionSelector } from '../../../../modules/canvas/components/dimension-selector';
import { useCurrentProject } from '../../../../modules/project/hooks/use-current-project';
import { useCanvasStore } from '../../../store/canvas-store';
import { ColorPicker } from '../color-picker';

const DIMENSION_PRESETS = [
  { label: '16:9', width: 1920, height: 1080 },
  { label: '4:3', width: 1600, height: 1200 },
  { label: '1:1', width: 1080, height: 1080 },
  { label: '9:16', width: 1080, height: 1920 }
];

export const NewProjectDialog = () => {
  const { projectName, setProjectName } = useCurrentProject();
  const { background, setBackground: setProjectBackground, width, height, setDimensions } = useCanvasStore();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <SquarePlus />
          New
        </Button>
      </DialogTrigger>
      <DialogContent className="w-125">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>Set up your new project with a name, dimensions, and background.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="My Awesome Design"
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <Label>Canvas Size</Label>
              <DimensionSelector>
                <Button variant="link" size="sm">
                  Choose from templates
                </Button>
              </DimensionSelector>
            </div>
            <div className="flex gap-2 items-center">
              <div className="flex items-center gap-2 flex-col">
                <Label htmlFor="width-input" className="text-xs text-muted-foreground w-full">
                  Width
                </Label>
                <Input
                  type="number"
                  id="width-input"
                  value={width}
                  onChange={(e) => setDimensions(Number(e.target.value), height)}
                  placeholder="0"
                  iconPosition="right"
                  icon={<span className="text-xs text-muted-foreground right-0 p-2">px</span>}
                />
              </div>

              <div className="flex items-center gap-2 flex-col ml-auto">
                <Label htmlFor="height-input" className="text-xs text-muted-foreground w-full  ">
                  Height
                </Label>
                <Input
                  type="number"
                  id="height-input"
                  value={height}
                  onChange={(e) => setDimensions(width, Number(e.target.value))}
                  placeholder="0"
                  iconPosition="right"
                  icon={<span className="text-xs text-muted-foreground right-0 p-2">px</span>}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              {DIMENSION_PRESETS.map((preset) => (
                <Button
                  key={preset.label}
                  variant="outline"
                  className="grow"
                  size="sm"
                  onClick={() => {
                    setDimensions(preset.width, preset.height);
                  }}>
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Background</Label>
            <ColorPicker value={background} onChange={setProjectBackground} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Create based on other project</Button>
          <Button type="submit" className="ml-auto">
            Create Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
