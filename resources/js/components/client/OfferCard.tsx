import { motion } from 'framer-motion';
import { Check, Clock, Package, Truck, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/ui/star-rating';
import { ProgressBar } from '@/components/ui/progress-bar';
import { cn } from '@/lib/utils';
import type { Offer, Pharmacy, Availability } from '@/types';

const availabilityConfig: Record<Availability, { label: string; variant: 'success' | 'warning' | 'danger' }> = {
  full: { label: 'Tout disponible', variant: 'success' },
  partial: { label: 'Partiel', variant: 'warning' },
  order: { label: 'Sur commande', variant: 'danger' },
};

export interface OfferCardProps {
  offer: Offer;
  rank?: number;
  onChoose: (offerId: number) => void;
  onViewDetail?: (offer: Offer) => void;
  isLoading?: boolean;
}

export function OfferCard({ offer, rank = 0, onChoose, onViewDetail, isLoading }: OfferCardProps) {
  const pharmacy = offer.pharmacy as Pharmacy | undefined;
  const score = offer.global_score ?? 0;
  const config = availabilityConfig[offer.availability as Availability] ?? availabilityConfig.partial;

  const scoreGradient =
    score >= 80 ? 'from-primary to-primary/80' : score >= 60 ? 'from-secondary to-secondary/80' : 'from-muted to-muted-foreground/50';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card
        className={cn(
          'h-full transition-all hover:shadow-card-hover hover:-translate-y-1',
          rank === 1 && 'ring-2 ring-primary/30'
        )}
      >
        {rank === 1 && (
          <div className="rounded-t-xl bg-primary/10 px-4 py-1.5 text-center text-sm font-semibold text-primary animate-pulse">
            Meilleure offre
          </div>
        )}
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-lg font-bold text-primary">
              {pharmacy?.name?.charAt(0) ?? 'P'}
            </div>
            <div>
              <p className="font-display font-semibold text-foreground">{pharmacy?.name ?? 'Pharmacie'}</p>
              {pharmacy?.is_verified && (
                <Badge variant="default" className="mt-0.5 text-xs">
                  Vérifiée
                </Badge>
              )}
            </div>
          </div>
          <StarRating value={pharmacy?.rating ?? 0} size="sm" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Score global</span>
            <span className="font-mono font-medium">{Math.round(score)}/100</span>
          </div>
          <ProgressBar
            value={score}
            max={100}
            className="h-2"
          />
          <div className="flex flex-wrap gap-2">
            <Badge variant={config.variant as 'success' | 'warning' | 'danger'}>
              <Package className="size-3 mr-1" />
              {config.label}
            </Badge>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="size-3" />
              Prêt en {offer.delay_minutes ?? '—'} min
            </span>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              {offer.delivery_type === 'delivery' ? <Truck className="size-3" /> : <Package className="size-3" />}
              {offer.delivery_type === 'delivery' ? 'Livraison' : 'Retrait'}
            </span>
          </div>
          <p className="text-right font-mono text-lg font-semibold text-foreground">
            {((Number(offer.total_price) || 0) + (Number(offer.delivery_fee) || 0) + (Number(offer.service_fee) || 0)).toLocaleString('fr-FR')} FCFA
          </p>
        </CardContent>
        <CardFooter className="flex gap-2">
          {onViewDetail && (
            <Button type="button" variant="outline" size="sm" onClick={() => onViewDetail(offer)}>
              Voir le détail
            </Button>
          )}
          <Button
            type="button"
            className="flex-1"
            onClick={() => onChoose(offer.id)}
            disabled={isLoading}
          >
            <Check className="size-4" />
            Choisir cette offre
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
