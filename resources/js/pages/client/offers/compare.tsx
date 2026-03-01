import { Head, router } from '@inertiajs/react';
import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Filter } from 'lucide-react';

import { Button } from '@/components/ui/button';
import ClientLayout from '@/layouts/client-layout';
import { OfferCard } from '@/components/client/OfferCard';
import type { Order, Offer } from '@/types';

type SortKey = 'score' | 'price' | 'delay' | 'availability' | 'delivery';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'score', label: 'Meilleur score' },
  { key: 'price', label: 'Moins cher' },
  { key: 'delay', label: 'Plus rapide' },
  { key: 'availability', label: 'Tout disponible' },
  { key: 'delivery', label: 'Livraison' },
];

export default function ClientOffersCompare({
  order,
  offers: initialOffers,
}: {
  order: Order;
  offers: Offer[];
}) {
  const [sort, setSort] = useState<SortKey>('score');
  const [choosingId, setChoosingId] = useState<number | null>(null);

  const offers = useMemo(() => {
    const list = [...(initialOffers ?? [])];
    switch (sort) {
      case 'price':
        return list.sort((a, b) => (a.total_price + (a.delivery_fee ?? 0)) - (b.total_price + (b.delivery_fee ?? 0)));
      case 'delay':
        return list.sort((a, b) => (a.delay_minutes ?? 999) - (b.delay_minutes ?? 999));
      case 'availability':
        return list.sort((a, b) => {
          const rank = (v: string) => (v === 'full' ? 3 : v === 'partial' ? 2 : 1);
          return rank(b.availability) - rank(a.availability);
        });
      case 'delivery':
        return list.sort((a, b) => (a.delivery_type === 'delivery' ? -1 : 1) - (b.delivery_type === 'delivery' ? -1 : 1));
      default:
        return list.sort((a, b) => (b.global_score ?? 0) - (a.global_score ?? 0));
    }
  }, [initialOffers, sort]);

  const expiresAt = order.expires_at ? new Date(order.expires_at) : null;
  const [timeLeft, setTimeLeft] = useState<string | null>(() => {
    if (!expiresAt) return null;
    const d = expiresAt.getTime() - Date.now();
    if (d <= 0) return 'Expiré';
    const m = Math.floor(d / 60000);
    const s = Math.floor((d % 60000) / 1000);
    return `${m} min ${s} s`;
  });

  useEffect(() => {
    if (!expiresAt) return;
    const t = setInterval(() => {
      const d = expiresAt.getTime() - Date.now();
      if (d <= 0) {
        setTimeLeft('Expiré');
        clearInterval(t);
        return;
      }
      const m = Math.floor(d / 60000);
      const s = Math.floor((d % 60000) / 1000);
      setTimeLeft(`${m} min ${s} s`);
    }, 1000);
    return () => clearInterval(t);
  }, [expiresAt]);

  const handleChoose = (offerId: number) => {
    setChoosingId(offerId);
    router.post(`/client/orders/${order.id}/choose-offer`, { offer_id: offerId }, {
      preserveScroll: true,
      onFinish: () => setChoosingId(null),
    });
  };

  return (
    <ClientLayout title="Comparer les offres">
      <Head title="Comparer les offres - PharmaConnect" />
      <div className="mt-6 max-w-4xl space-y-6">
        {timeLeft && (
          <div className="flex items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 shadow-sm">
            <Clock className="size-5 shrink-0" />
            <span className="font-medium">Offres valables encore : {timeLeft}</span>
          </div>
        )}

        <div className="rounded-xl border-0 bg-white p-4 shadow-md shadow-slate-200/50 ring-1 ring-slate-200/60">
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="size-4 shrink-0 text-slate-500" />
            {SORT_OPTIONS.map((opt) => (
              <Button
                key={opt.key}
                variant={sort === opt.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSort(opt.key)}
              >
                {opt.label}
              </Button>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Score : Disponibilité 30% · Prix 25% · Délai 20% · Fiabilité 15% · Livraison 10%
          </p>
        </div>

        {offers.length === 0 ? (
          <div className="rounded-xl border-0 bg-white p-12 text-center text-slate-600 shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/60">
            Aucune offre pour le moment. Les pharmacies de votre zone vont recevoir votre demande.
          </div>
        ) : (
          <motion.ul
            className="grid gap-4 sm:grid-cols-2"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.08 } },
              hidden: {},
            }}
          >
            {offers.map((offer, index) => (
              <motion.li
                key={offer.id}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <OfferCard
                  offer={offer}
                  rank={sort === 'score' ? index + 1 : 0}
                  onChoose={handleChoose}
                  isLoading={choosingId === offer.id}
                />
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>
    </ClientLayout>
  );
}
