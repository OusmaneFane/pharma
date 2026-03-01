import { Head, Link } from '@inertiajs/react';
import { FileText, Package, CheckCircle2, MapPin, Truck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ClientLayout from '@/layouts/client-layout';
import type { Order, OrderStatus } from '@/types';

const statusLabels: Record<OrderStatus, string> = {
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
  accepted: 'bg-primary/10 text-primary',
  preparing: 'bg-violet-100 text-violet-800',
  ready: 'bg-sky-100 text-sky-800',
  in_delivery: 'bg-orange-100 text-orange-800',
  completed: 'bg-slate-100 text-slate-700',
  cancelled: 'bg-red-100 text-red-800',
};

interface Stats {
  total: number;
  in_progress: number;
  completed: number;
}

const statCards: { key: keyof Stats; label: string; icon: typeof FileText; bg: string; iconColor: string }[] = [
  { key: 'total', label: 'Total commandes', icon: FileText, bg: 'bg-primary/10', iconColor: 'text-primary' },
  { key: 'in_progress', label: 'En cours', icon: Package, bg: 'bg-violet-100', iconColor: 'text-violet-600' },
  { key: 'completed', label: 'Terminées', icon: CheckCircle2, bg: 'bg-slate-100', iconColor: 'text-slate-600' },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function ClientOrdersIndex({
  orders,
  stats = { total: 0, in_progress: 0, completed: 0 },
}: {
  orders: { data: Order[]; current_page: number; last_page: number; per_page: number; total: number; links?: { url: string | null; label: string; active: boolean }[] };
  stats?: Stats;
}) {
  const list = orders?.data ?? [];
  const hasPages = orders?.last_page > 1;
  const links = orders?.links ?? [];

  return (
    <ClientLayout title="Mes commandes">
      <Head title="Mes commandes - PharmaConnect" />

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
                <p className="font-display text-2xl font-bold text-slate-900">
                  {stats[key].toLocaleString('fr-FR')}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        {list.length === 0 ? (
          <Card className="overflow-hidden border-0 bg-white shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/60">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
                <FileText className="size-8 text-primary" />
              </div>
              <h2 className="mt-4 font-display text-lg font-semibold text-slate-800">
                Aucune commande
              </h2>
              <p className="mt-2 max-w-sm text-sm text-slate-500">
                Créez une demande pour recevoir des offres des pharmacies et passer commande.
              </p>
              <Button asChild className="mt-6">
                <Link href="/client/orders/new">Créer une demande</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((order: Order) => (
                <Link key={order.id} href={`/client/orders/${order.id}`}>
                  <Card className="h-full overflow-hidden border-0 bg-white shadow-md shadow-slate-200/50 ring-1 ring-slate-200/60 transition-all hover:shadow-lg hover:ring-primary/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-slate-100 px-5 py-4">
                      <span className="font-mono text-sm font-semibold text-primary">#{order.id}</span>
                      <Badge
                        variant="default"
                        className={statusVariants[order.status] ?? 'bg-slate-100 text-slate-700'}
                      >
                        {statusLabels[order.status as OrderStatus] ?? order.status}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-3 p-5">
                      <p className="flex items-center gap-2 text-sm text-slate-600">
                        {order.type === 'prescription' ? 'Ordonnance' : 'Liste'} · {order.delivery_type === 'pickup' ? 'Retrait' : 'Livraison'}
                      </p>
                      {order.zone && (
                        <p className="flex items-center gap-2 text-xs text-slate-500">
                          <MapPin className="size-3.5 shrink-0" />
                          {order.zone}
                        </p>
                      )}
                      {order.items?.length ? (
                        <p className="flex items-center gap-2 text-xs text-slate-500">
                          <Truck className="size-3.5 shrink-0" />
                          {order.items.length} médicament(s)
                        </p>
                      ) : null}
                      <p className="text-xs text-slate-400">{formatDate(order.created_at)}</p>
                      <p className="text-sm font-medium text-primary">
                        Voir le détail →
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {hasPages && links?.length > 0 && (
              <nav className="mt-6 flex flex-wrap items-center justify-center gap-2">
                {links.map((link, i) => (
                  <span key={i}>
                    {link.url ? (
                      <Link
                        href={link.url}
                        className={`inline-flex min-w-9 items-center justify-center rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                          link.active
                            ? 'border-primary bg-primary text-white'
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
      </div>
    </ClientLayout>
  );
}
