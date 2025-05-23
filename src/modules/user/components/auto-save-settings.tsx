import { useState } from 'react';

import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';

export const AutoSaveSettings = () => {
  const [autoSave, setAutoSave] = useState(true);
  const [autoSaveInterval, setAutoSaveInterval] = useState(5);

  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold mb-2 text-foreground">Auto-save Settings</h3>
      <div className="space-y-3 bg-muted/30 p-3 rounded-lg border border-border/50">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="auto-save" className="text-sm">
              Auto-save Projects
            </Label>
            <p className="text-xs text-muted-foreground">Automatically save changes as you work</p>
          </div>
          <Switch id="auto-save" checked={autoSave} onCheckedChange={setAutoSave} />
        </div>

        {autoSave && (
          <div className="space-y-1 pt-2 border-t border-border/30">
            <Label htmlFor="auto-save-interval" className="text-sm">
              Auto-save Interval
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="auto-save-interval"
                type="number"
                min="1"
                max="60"
                value={autoSaveInterval}
                onChange={(e) => setAutoSaveInterval(Number.parseInt(e.target.value))}
                className="rounded-lg"
              />
              <span className="text-sm text-muted-foreground whitespace-nowrap">minutes</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
