import { HTMLAttributes, forwardRef } from 'react';
import { cn } from './Button';

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'signal' | 'actor' | 'depth2' | 'depth3';
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold font-mono tabular-nums transition-colors',
          {
            'bg-ink-700 text-text-hi': variant === 'default',
            'bg-signal/20 text-signal': variant === 'signal',
            'bg-actor/20 text-actor': variant === 'actor',
            'bg-depth-2/20 text-depth-2': variant === 'depth2',
            'bg-depth-3/20 text-depth-3': variant === 'depth3',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge';
