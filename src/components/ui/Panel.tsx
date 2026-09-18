import { HTMLAttributes, forwardRef } from 'react';
import { cn } from './Button';

export const Panel = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-[14px] border border-line bg-ink-800 p-4 transition-colors hover:border-text-lo/30',
        className
      )}
      {...props}
    />
  )
);
Panel.displayName = 'Panel';
