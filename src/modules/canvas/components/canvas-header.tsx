import { RefreshCwIcon } from 'lucide-react';
import { useState } from 'react';
import { GrRedo, GrUndo } from 'react-icons/gr';

import { ConfirmModal } from '@/shared/components/common/confirm-modal';

import { Button } from '../../../shared/components/ui/button';
import { useLocalProject } from '../../project/hooks/use-local-project';
import { useCanvasReset } from '../hooks/use-canvas-reset';

export const CanvasHeader = () => {
  const { name, setName } = useLocalProject();
  const { resetCanvas } = useCanvasReset();
  const [isOpen, setIsOpen] = useState(false);

  const handleReset = () => {
    resetCanvas();
    setIsOpen(false);
  };

  return (
    <>
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
          <Button
            variant="outline"
            size="icon"
            className="backdrop-blur-xl bg-canvas-background/80"
            onClick={() => setIsOpen(true)}>
            <RefreshCwIcon />
          </Button>
        </div>
      </div>

      <ConfirmModal
        title="Reset Canvas"
        description="Are you sure you want to reset the canvas?"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleReset}
      />
    </>
  );
};
