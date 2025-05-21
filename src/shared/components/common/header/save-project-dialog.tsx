import { Download, Save } from 'lucide-react';
import { FC } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/shared/components/ui/dialog';
import { Label } from '@/shared/components/ui/label';

import { useCurrentProject } from '../../../../modules/project/hooks/use-current-project';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';

export const SaveProjectDialog: FC = () => {
  const { projectName, setProjectName } = useCurrentProject();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size={'sm'}>
          <Save />
          Save
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Project</DialogTitle>
          <DialogDescription>Save your current project or download a copy.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-1.5">
            <Label htmlFor="save-name">Project Name</Label>
            <Input
              id="save-name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="My Awesome Design"
            />
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline">
            <Download />
            Download Copy
          </Button>
          <Button type="submit" className="ml-auto">
            <Save />
            Save Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
