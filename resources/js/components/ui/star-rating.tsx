import { Star } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface StarRatingProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-6',
};

function StarRating({ value, max = 5, size = 'md', className }: StarRatingProps) {
  const stars = Array.from({ length: max }, (_, i) => i + 1);
  const fullStars = Math.floor(value);
  const hasHalf = value - fullStars >= 0.25;
  const s = sizeClasses[size];

  return (
    <div
      className={cn('flex items-center gap-0.5', className)}
      role="img"
      aria-label={`Note : ${value} sur ${max}`}
    >
      {stars.map((i) => {
        const filled = i <= fullStars;
        const half = i === fullStars + 1 && hasHalf;
        return (
          <Star
            key={i}
            className={cn(
              s,
              filled
                ? 'fill-secondary text-secondary'
                : half
                  ? 'fill-secondary/50 text-secondary'
                  : 'text-muted-foreground'
            )}
            aria-hidden
          />
        );
      })}
    </div>
  );
}

export { StarRating };
