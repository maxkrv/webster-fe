import * as SliderPrimitive from '@radix-ui/react-slider';
import * as React from 'react';

import { cn } from '../../lib/utils';

type DisplayFormat =
  | { type: 'numeric'; unit?: string }
  | { type: 'percentage'; showSymbol?: boolean }
  | { type: 'size'; labels: string[] }
  | { type: 'custom'; formatter: (value: number, max: number) => string };

interface EnhancedSliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  displayFormat?: DisplayFormat;
  labels?: {
    min?: string;
    mid?: string;
    max?: string;
  };
  showValueDisplay?: boolean;
}

export const EnhancedSlider: React.FC<EnhancedSliderProps> = ({
  defaultValue,
  value,
  min = 0,
  max = 100,
  step = 1,
  displayFormat = { type: 'numeric' },
  labels,
  showValueDisplay = true,
  className,
  disabled,
  onValueChange,
  ...props
}) => {
  const [internalValue, setInternalValue] = React.useState<number[]>(defaultValue || [0]);
  const currentValue = value !== undefined ? value : internalValue;

  const handleValueChange = React.useCallback(
    (newValue: number[]) => {
      setInternalValue(newValue);
      if (onValueChange) {
        onValueChange(newValue);
      }
    },
    [onValueChange]
  );

  const displayValue = React.useMemo(() => {
    const currentVal = currentValue[0];

    switch (displayFormat.type) {
      case 'percentage': {
        const percentValue = Math.round((currentVal / max) * 100);
        return displayFormat.showSymbol ? `${percentValue}%` : `${percentValue}`;
      }

      case 'size': {
        const normalizedValue = currentVal / max;
        const sizeIndex = Math.floor(normalizedValue * displayFormat.labels.length);
        const adjustedIndex = Math.min(sizeIndex, displayFormat.labels.length - 1);
        return displayFormat.labels[adjustedIndex];
      }

      case 'custom':
        return displayFormat.formatter(currentVal, max);

      case 'numeric':
      default:
        return `${currentVal}${displayFormat.unit || ''}`;
    }
  }, [currentValue, max, displayFormat]);

  return (
    <div className={cn('relative w-full', className)} data-testid="enhanced-slider">
      <div className="relative py-2">
        <SliderPrimitive.Root
          defaultValue={defaultValue}
          value={value}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          onValueChange={handleValueChange}
          className={cn(
            'relative flex w-full touch-none select-none items-center',
            disabled && 'cursor-not-allowed opacity-50'
          )}
          {...props}>
          <SliderPrimitive.Track className="bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-2 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2">
            <SliderPrimitive.Range className="absolute h-full bg-primary" />
          </SliderPrimitive.Track>
          <SliderPrimitive.Thumb
            className={cn(
              'block h-6 w-6 rounded-full border-2 border-primary bg-background shadow-sm ring-ring/50 transition-[color,box-shadow] hover:ring-3 focus-visible:ring-3 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50'
            )}>
            {showValueDisplay && (
              <div className="absolute inset-0 flex items-center justify-center text-2xs font-semibold">
                {displayValue}
              </div>
            )}
          </SliderPrimitive.Thumb>
        </SliderPrimitive.Root>
      </div>

      {labels && (
        <div className="flex justify-between text-xs text-muted-foreground" aria-hidden="true">
          {labels.min && <span>{labels.min}</span>}
          {labels.mid && <span className="absolute left-1/2 -translate-x-1/2">{labels.mid}</span>}
          {labels.max && <span>{labels.max}</span>}
        </div>
      )}
    </div>
  );
};
