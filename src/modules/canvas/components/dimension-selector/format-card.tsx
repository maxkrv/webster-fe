import { Check } from 'lucide-react';
import type React from 'react';

import { cn } from '../../../../shared/lib/utils';
import { getAspectRatio } from './utils';

export interface FormatOption {
  name: string;
  width: number;
  height: number;
  description?: string;
  icon: React.ReactNode;
}

interface FormatCardProps {
  format: FormatOption;
  isSelected: boolean;
  onClick: () => void;
}

export const FormatCard = ({ format, isSelected, onClick }: FormatCardProps) => {
  const aspectRatio = getAspectRatio(format.width, format.height);
  const isVertical = format.height > format.width;
  const isSquare = format.width === format.height;

  return (
    <div
      className={cn(
        'relative rounded-xl border p-3.5 cursor-pointer transition-all hover:shadow-md',
        isSelected
          ? 'border-primary/40 bg-primary/10 shadow-md'
          : 'border-border hover:border-primary/30 hover:bg-primary/5'
      )}
      onClick={onClick}>
      {isSelected && (
        <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
          <Check className="h-3 w-3 text-white" />
        </div>
      )}

      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-primary">{format.icon}</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate">{format.name}</h3>
          <p className="text-xs text-muted-foreground">{aspectRatio}</p>
        </div>
      </div>

      <div
        className={cn(
          'relative flex items-center justify-center w-full rounded-lg p-2 mb-2',
          isSelected ? 'bg-primary/20' : 'bg-muted'
        )}>
        <div
          className={cn(
            'relative border',
            isSelected ? 'border-primary/40 bg-background' : 'border-border bg-background'
          )}
          style={{
            width: isVertical ? '30px' : isSquare ? '40px' : '60px',
            height: isVertical ? '60px' : isSquare ? '40px' : '34px'
          }}
        />

        <div className="ml-3 text-xs font-medium">
          <span className="text-foreground">{format.width}</span>
          <span className="text-muted-foreground mx-1">×</span>
          <span className="text-foreground">{format.height}</span>
          <span className="text-muted-foreground ml-0.5">px</span>
        </div>
      </div>

      {format.description && <p className="text-xs text-muted-foreground line-clamp-2 mt-1.5">{format.description}</p>}
    </div>
  );
};
