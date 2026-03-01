import * as React from 'react';

import { cn } from '@/lib/utils';

const MALI_PREFIX = '+223';

export interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: string;
  onChange?: (value: string, fullNumber: string) => void;
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, value = '', onChange, ...props }, ref) => {
    const raw = value.replace(/\D/g, '').replace(/^223/, '');
    const display = raw ? `${MALI_PREFIX} ${formatMaliNumber(raw)}` : '';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value.replace(/\D/g, '');
      const maliOnly = v.startsWith('223') ? v.slice(3) : v;
      const full = maliOnly ? `223${maliOnly}` : '';
      onChange?.(maliOnly, full ? `+${full}` : '');
    };

    return (
      <div className="flex rounded-md border border-input bg-background">
        <span className="inline-flex items-center px-3 text-sm text-muted-foreground border-r border-input">
          {MALI_PREFIX}
        </span>
        <input
          ref={ref}
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="00 00 00 00 00"
          className={cn(
            'flex h-9 w-full rounded-r-md border-0 bg-transparent px-3 py-1 text-sm font-mono outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          value={display}
          onChange={handleChange}
          maxLength={18}
          {...props}
        />
      </div>
    );
  }
);
PhoneInput.displayName = 'PhoneInput';

function formatMaliNumber(digits: string): string {
  const d = digits.slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)} ${d.slice(2)}`;
  return `${d.slice(0, 2)} ${d.slice(2, 4)} ${d.slice(4, 6)} ${d.slice(6)}`;
}

export { PhoneInput, MALI_PREFIX };
