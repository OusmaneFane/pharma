import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary/10 text-primary border border-primary/20',
        pending: 'bg-amber-100 text-amber-800 border border-amber-200',
        accepted: 'bg-primary/10 text-primary border border-primary/20',
        preparing: 'bg-blue-100 text-blue-800 border border-blue-200',
        ready: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
        in_delivery: 'bg-sky-100 text-sky-800 border border-sky-200',
        completed: 'bg-green-100 text-green-800 border border-green-200',
        cancelled: 'bg-red-100 text-red-800 border border-red-200',
        offers_received: 'bg-primary/10 text-primary border border-primary/20',
        success: 'bg-green-100 text-green-800 border border-green-200',
        danger: 'bg-red-100 text-red-800 border border-red-200',
        warning: 'bg-amber-100 text-amber-800 border border-amber-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
