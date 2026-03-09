import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Package, Clock, CheckCircle2, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import PharmacyLayout from '@/layouts/pharmacy-layout';
import type { Order } from '@/types';

type OrderWithClient = Order & {
  client?: { user?: { name?: string } };
};

const statusLabels: Record<string, string> = {
  pending: 'En attente',
  offers_received: 'Offres reçues',
  accepted: 'Acceptée',
  preparing: 'En préparation',
  ready: 'Prêt',
  in_delivery: 'En livraison',
  completed: 'Terminée',
  cancelled: 'Annulée',
};

const statusVariants: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  offers_received: 'bg-blue-100 text-blue-800',
  accepted: 'bg-emerald-100 text-emerald-800',
  preparing: 'bg-violet-100 text-violet-800',
  ready: 'bg-sky-100 text-sky-800',
  in_delivery: 'bg-orange-100 text-orange-800',
  completed: 'bg-slate-100 text-slate-700',
  cancelled: 'bg-red-100 text-red-800',
};

interface Stats {
  total: number;
  active: number;
  completed: number;
}

interface PaginatedOrders {
  data: OrderWithClient[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  links?: { url: string | null; label: string; active: boolean }[];
}

const statCards: { key: keyof Stats; label: string; icon: typeof Package; bg: string; iconColor: string }[] = [
  { key: 'total', label: 'Total commandes', icon: Package, bg: 'bg-emerald-100', iconColor: 'text-emerald-600' },
  { key: 'active', label: 'En cours', icon: Clock, bg: 'bg-violet-100', iconColor: 'text-violet-600' },
  { key: 'completed', label: 'Terminées', icon: CheckCircle2, bg: 'bg-slate-100', iconColor: 'text-slate-600' },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function PharmacyOrdersIndex({
  orders,
  stats = { total: 0, active: 0, completed: 0 },
}: {
  orders: PaginatedOrders;
  stats?: Stats;
}) {
  const list = orders?.data ?? [];
  const hasPages = orders?.last_page > 1;
  const links = orders?.links ?? [];

  const [pickupModalOrderId, setPickupModalOrderId] = useState<number | null>(null);
  const [pickupCode, setPickupCode] = useState('');
  const [pickupError, setPickupError] = useState<string | null>(null);
  const [pickupSubmitting, setPickupSubmitting] = useState(false);

  const handlePickupSubmit = () => {
    if (!pickupModalOrderId) return;
    if (!pickupCode.trim()) {
      setPickupError('Veuillez entrer le code de retrait.');
      return;
    }

    setPickupSubmitting(true);
    setPickupError(null);

    router.post(
      `/pharmacy/orders/${pickupModalOrderId}/complete`,
      { pickup_code: pickupCode.trim() },
      {
        preserveScroll: true,
        onError: (errors) => {
          if (errors.pickup_code) {
            setPickupError(errors.pickup_code as string);
          }
        },
        onSuccess: () => {
          setPickupModalOrderId(null);
          setPickupCode('');
          setPickupError(null);
        },
        onFinish: () => setPickupSubmitting(false),
      }
    );
  };

  return (
    <PharmacyLayout title="Commandes">
      <Head title="Commandes - PharmaConnect Pharmacie" />

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {statCards.map(({ key, label, icon: Icon, bg, iconColor }) => (
          <Card
            key={key}
            className="overflow-hidden border-0 bg-white shadow-md shadow-slate-200/40 ring-1 ring-slate-200/50"
          >
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${bg} ${iconColor}`}>
                <Icon className="size-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <p className="font-display text-xl font-bold text-slate-900">
                  {stats[key].toLocaleString('fr-FR')}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8 overflow-hidden border-0 bg-white shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/60">
        <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-emerald-50/80 to-white px-6 py-4">
          <CardTitle className="text-base font-semibold text-slate-800">
            Liste des commandes
          </CardTitle>
          <p className="mt-0.5 text-sm text-slate-500">
            Commandes où votre pharmacie a été retenue par le client
          </p>
        </CardHeader>
        <CardContent className="p-0">
          {list.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Package className="size-12 text-slate-300" />
              <p className="mt-3 text-sm font-medium text-slate-600">Aucune commande</p>
              <p className="mt-1 text-xs text-slate-500">
                Répondez aux demandes pour que les clients puissent choisir votre offre.
              </p>
              <Button asChild className="mt-4" variant="outline">
                <Link href="/pharmacy/requests">Voir les demandes</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/80">
                      <th className="px-6 py-3 font-semibold text-slate-700">N°</th>
                      <th className="px-6 py-3 font-semibold text-slate-700">Client</th>
                      <th className="px-6 py-3 font-semibold text-slate-700">Statut</th>
                      <th className="px-6 py-3 font-semibold text-slate-700">Montant</th>
                      <th className="px-6 py-3 font-semibold text-slate-700">Date</th>
                      <th className="px-6 py-3 font-semibold text-slate-700">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {list.map((order: OrderWithClient) => (
                      <tr key={order.id} className="transition-colors hover:bg-slate-50/50">
                        <td className="px-6 py-4 font-mono font-medium text-slate-600">#{order.id}</td>
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-2 text-slate-800">
                            <User className="size-4 text-slate-400" />
                            {order.client?.user?.name ?? '—'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant="default"
                            className={statusVariants[order.status] ?? 'bg-slate-100 text-slate-700'}
                          >
                            {statusLabels[order.status] ?? order.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-800">
                          {order.total_amount != null
                            ? `${Number(order.total_amount).toLocaleString('fr-FR')} FCFA`
                            : '—'}
                        </td>
                        <td className="px-6 py-4 text-slate-500">{formatDate(order.created_at)}</td>
                        <td className="px-6 py-4 space-x-3">
                          <Link
                            href={`/pharmacy/requests/${order.id}`}
                            className="text-emerald-600 font-medium hover:underline"
                          >
                            Détail
                          </Link>
                          {order.status !== 'completed' && order.status !== 'cancelled' && (
                            <button
                              type="button"
                              className="text-xs font-semibold text-emerald-700 hover:underline"
                              onClick={() => {
                                setPickupModalOrderId(order.id);
                                setPickupCode('');
                                setPickupError(null);
                              }}
                            >
                              Marquer retirée
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {hasPages && links.length > 0 && (
                <nav className="flex flex-wrap items-center justify-center gap-2 border-t border-slate-100 px-6 py-4">
                  {links.map((link, i) => (
                    <span key={i}>
                      {link.url ? (
                        <Link
                          href={link.url}
                          className={`inline-flex min-w-9 items-center justify-center rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                            link.active
                              ? 'border-emerald-500 bg-emerald-500 text-white'
                              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {link.label.replace(/&(previous|next);/g, (_, m) => (m === 'previous' ? '←' : '→'))}
                        </Link>
                      ) : (
                        <span className="inline-flex min-w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400">
                          {link.label.replace(/&(previous|next);/g, (_, m) => (m === 'previous' ? '←' : '→'))}
                        </span>
                      )}
                    </span>
                  ))}
                </nav>
              )}
            </>
          )}
        </CardContent>
      </Card>
      <Dialog
        open={pickupModalOrderId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPickupModalOrderId(null);
            setPickupCode('');
            setPickupError(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer le retrait</DialogTitle>
            <DialogDescription>
              Saisissez le code de retrait communiqué par le client pour marquer la commande comme
              terminée.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="pickup_code">Code de retrait</Label>
            <Input
              id="pickup_code"
              value={pickupCode}
              onChange={(e) => setPickupCode(e.target.value)}
              autoComplete="one-time-code"
              autoFocus
            />
            {pickupError && <p className="text-sm text-destructive">{pickupError}</p>}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setPickupModalOrderId(null);
                setPickupCode('');
                setPickupError(null);
              }}
              disabled={pickupSubmitting}
            >
              Annuler
            </Button>
            <Button type="button" onClick={handlePickupSubmit} disabled={pickupSubmitting}>
              {pickupSubmitting ? 'Validation…' : 'Marquer comme retirée'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PharmacyLayout>
  );
}
