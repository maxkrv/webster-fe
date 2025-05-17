import type React from 'react';
import { FC } from 'react';

import { cn } from '@/shared/lib/utils';

interface ImagePlaceholderProps extends React.HTMLAttributes<HTMLDivElement> {
  patternDensity?: 'low' | 'medium' | 'high';
  iconOpacity?: number;
}

export const ImagePlaceholder: FC<ImagePlaceholderProps> = ({
  className,
  patternDensity = 'medium',
  iconOpacity = 0.3,
  ...props
}) => {
  // Map density to actual values
  const densityMap = {
    low: 30,
    medium: 20,
    high: 12
  };

  const density = densityMap[patternDensity];

  return (
    <div
      className={cn(
        'relative w-full h-full overflow-hidden rounded-md bg-muted flex items-center justify-center',
        className
      )}
      style={{
        backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.03) 1px, transparent ${2}px)`,
        backgroundSize: `${density}px ${density}px`,
        backgroundPosition: '0 0'
      }}
      {...props}>
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-background/10 to-transparent" />

      {/* Corner brackets */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top-left corner */}
        <div className="absolute top-0 left-0 m-3 w-[15%] h-[15%] border-t-3 border-l-3" />

        {/* Top-right corner */}
        <div className="absolute top-0 right-0 m-3 w-[15%] h-[15%] border-t-3 border-r-3" />

        {/* Bottom-left corner */}
        <div className="absolute bottom-0 left-0 m-3 w-[15%] h-[15%] border-b-3 border-l-3" />

        {/* Bottom-right corner */}
        <div className="absolute bottom-0 right-0 m-3 w-[15%] h-[15%] border-b-3 border-r-3" />
      </div>

      {/* Center icon with backdrop */}
      <div className="relative flex items-center justify-center size-1/4 min-w-8 min-h-8 max-w-16 max-h-16 bg-background/50 rounded-full backdrop-blur-[2px]">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="relative w-full h-full text-foreground p-1.5"
          style={{ opacity: iconOpacity }}
          aria-hidden="true">
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <path d="M3 14l4-4a3 5 0 0 1 3 0l4 4" />
          <path d="M13 12l2-2a3 5 0 0 1 3 0l3 3" />
          <circle cx="8.5" cy="8.5" r="1.5" />
        </svg>
      </div>
    </div>
  );
};
