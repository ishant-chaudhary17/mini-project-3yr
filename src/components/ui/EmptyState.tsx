import { ReactNode } from 'react';
import { cn } from './Button';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
      {icon && <div className="mb-4 text-text-lo/50">{icon}</div>}
      <h3 className="mb-1 text-sm font-semibold text-text-hi">{title}</h3>
      <p className="text-sm text-text-lo mb-4 max-w-sm">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
