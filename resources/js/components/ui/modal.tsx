import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
  contentClassName,
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'border-border bg-card backdrop-blur-sm sm:max-w-lg',
          contentClassName
        )}
      >
        {(title || description) && (
          <DialogHeader>
            {title && (
              <DialogTitle className="font-display">{title}</DialogTitle>
            )}
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
        )}
        <div className={cn('py-4', className)}>{children}</div>
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}

export { Modal };
