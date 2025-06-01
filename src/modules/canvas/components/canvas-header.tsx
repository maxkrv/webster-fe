'use client';

import { RefreshCwIcon } from 'lucide-react';
import { GrRedo, GrUndo } from 'react-icons/gr';

import { Button } from '../../../shared/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../shared/components/ui/tooltip';
import { useLocalProject } from '../../project/hooks/use-local-project';
import { useCanvasHistory } from '../hooks/use-canvas-history';
import { useCanvasReset } from '../hooks/use-canvas-reset';

export const CanvasHeader = () => {
  const { name, setName } = useLocalProject();
  const { resetCanvas } = useCanvasReset();
  const { undo, redo, canUndo, canRedo, getHistoryInfo } = useCanvasHistory();

  const historyInfo = getHistoryInfo();

  return (
    <div className="flex items-center justify-between absolute top-2 left-2 right-2 z-10">
      <div className="flex items-center gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="backdrop-blur-xl bg-canvas-background/80"
              onClick={undo}
              disabled={!canUndo}>
              <GrUndo />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            Undo (Ctrl+Z) {historyInfo.current > 1 && `- ${historyInfo.current - 1}/${historyInfo.total}`}
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="backdrop-blur-xl bg-canvas-background/80"
              onClick={redo}
              disabled={!canRedo}>
              <GrRedo />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            Redo (Ctrl+Y) {canRedo && `- ${historyInfo.current + 1}/${historyInfo.total}`}
          </TooltipContent>
        </Tooltip>
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
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="backdrop-blur-xl bg-canvas-background/80"
              onClick={resetCanvas}>
              <RefreshCwIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Reset Canvas</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};
