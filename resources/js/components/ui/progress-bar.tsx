import * as React from 'react';

import { cn } from '@/lib/utils';

export interface ProgressBarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  showLabel?: boolean;
}

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ className, value, max = 100, showLabel = false, ...props }, ref) => {
    const pct = Math.min(100, Math.max(0, (value / max) * 100));
    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        <div
          className="h-2 w-full overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        >
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        {showLabel && (
          <span className="mt-1 text-xs text-muted-foreground">
            {Math.round(pct)}%
          </span>
        )}
      </div>
    );
  }
);
ProgressBar.displayName = 'ProgressBar';

export { ProgressBar };
