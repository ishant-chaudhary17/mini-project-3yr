import { cn } from './Button';

interface SegmentedControlProps<T extends string | number> {
  options: { label: string; value: T }[];
  value: T;
  onChange: (val: T) => void;
  className?: string;
  disabled?: boolean;
}

export function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  className,
  disabled
}: SegmentedControlProps<T>) {
  return (
    <div
      className={cn(
        'inline-flex h-9 items-center justify-center rounded-lg bg-ink-700 p-1 text-text-lo',
        disabled && 'opacity-50 pointer-events-none',
        className
      )}
    >
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            'inline-flex items-center justify-center whitespace-nowrap rounded-[7px] px-3 py-1 text-xs font-medium ring-offset-ink-900 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2',
            value === opt.value
              ? 'bg-ink-800 text-text-hi shadow-sm'
              : 'hover:bg-ink-800/50 hover:text-text-hi'
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
