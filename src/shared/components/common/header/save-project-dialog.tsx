import { Download, Save } from 'lucide-react';
import { FC, useState } from 'react';

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

import { useCurrentProject, useSelectedProjectId } from '../../../../modules/project/hooks/use-current-project';
import { useExport } from '../../../../modules/project/hooks/use-export';
import { useLocalProject } from '../../../../modules/project/hooks/use-local-project';
import { useProjectCreate } from '../../../../modules/project/hooks/use-project-create';
import { useProjectSave } from '../../../../modules/project/hooks/use-project-save';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';

export const SaveProjectDialog: FC = () => {
  const [open, setOpen] = useState(false);
  const { name, setName, canvas } = useLocalProject();
  const { exportCanvas, isExporting } = useExport();
  const { id } = useSelectedProjectId();
  const { data: currentProject } = useCurrentProject();

  const saveProject = useProjectSave(() => setOpen(false));
  const createProject = useProjectCreate(() => setOpen(false));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
              value={currentProject?.name || name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Awesome Design"
            />
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => exportCanvas({ format: 'json', quality: 100 })}
            isLoading={(!canvas && !id) || isExporting}
            disabled={(!canvas && !id) || isExporting}>
            <Download />
            Download Copy
          </Button>
          {id ? (
            <Button
              className="ml-auto"
              disabled={saveProject.isPending}
              isLoading={saveProject.isPending}
              onClick={() => saveProject.mutate()}>
              <Save />
              Save Changes
            </Button>
          ) : (
            <Button
              className="ml-auto"
              disabled={createProject.isPending}
              isLoading={createProject.isPending}
              onClick={() => createProject.mutate()}>
              <Save />
              Create Project
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
