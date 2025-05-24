import { RefreshCwIcon } from 'lucide-react';
import { GrRedo, GrUndo } from 'react-icons/gr';

import { Button } from '../../../shared/components/ui/button';
import { useLocalProject } from '../../project/hooks/use-local-project';

export const CanvasHeader = () => {
  const { name, setName } = useLocalProject();

  return (
    <div className="flex items-center justify-between absolute top-2 left-2 right-2 z-10">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" className="backdrop-blur-xl bg-canvas-background/80">
          <GrUndo />
        </Button>
        <Button variant="outline" size="icon" className="backdrop-blur-xl bg-canvas-background/80">
          <GrRedo />
        </Button>
      </div>
      <div className="relative mx-auto right-6">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="text-center text-lg font-medium bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-md px-2 py-1 text-foreground min-w-fit max-w-full "
        />
      </div>
      <div className="flex items-center">
        <Button variant="outline" size="icon" className="backdrop-blur-xl bg-canvas-background/80">
          <RefreshCwIcon />
        </Button>
      </div>
    </div>
  );
};
