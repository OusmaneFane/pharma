import * as React from 'react';

import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  id: string;
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: (id: string) => void;
  className?: string;
}

const typeStyles: Record<ToastType, string> = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  info: 'bg-primary/5 border-primary/20 text-primary',
};

function Toast({
  message,
  type = 'info',
  className,
}: Omit<ToastProps, 'id' | 'duration' | 'onClose'>) {
  return (
    <div
      role="alert"
      className={cn(
        'rounded-lg border px-4 py-3 text-sm shadow-lg',
        typeStyles[type],
        className
      )}
    >
      {message}
    </div>
  );
}

export { Toast };
