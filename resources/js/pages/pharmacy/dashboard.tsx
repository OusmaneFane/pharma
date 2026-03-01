import { Head, Link } from '@inertiajs/react';
import { Inbox, Package, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PharmacyLayout from '@/layouts/pharmacy-layout';

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

interface Kpis {
  pending_requests: number;
  total_orders: number;
  active_orders: number;
  completed_orders: number;
}

interface RecentOrder {
  id: number;
  status: string;
  client_name: string;
  total_amount: number | null;
  created_at: string;
}

const kpiConfig = [
  {
    key: 'pending_requests',
    label: 'Demandes en attente',
    description: 'À traiter ou à répondre',
    icon: Inbox,
    href: '/pharmacy/requests',
    bgClass: 'bg-amber-500/10',
    iconClass: 'text-amber-600',
  },
  {
    key: 'total_orders',
    label: 'Commandes totales',
    description: 'Vos commandes gagnées',
    icon: Package,
    href: '/pharmacy/orders',
    bgClass: 'bg-emerald-500/10',
    iconClass: 'text-emerald-600',
  },
  {
    key: 'active_orders',
    label: 'En cours',
    description: 'En préparation ou livraison',
    icon: Clock,
    href: '/pharmacy/orders',
    bgClass: 'bg-violet-500/10',
    iconClass: 'text-violet-600',
  },
  {
    key: 'completed_orders',
    label: 'Terminées',
    description: 'Commandes livrées',
    icon: CheckCircle2,
    href: '/pharmacy/orders',
    bgClass: 'bg-slate-500/10',
    iconClass: 'text-slate-600',
  },
];

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function PharmacyDashboard({
  kpis,
  recent_orders = [],
}: {
  kpis: Kpis;
  recent_orders?: RecentOrder[];
}) {
  return (
    <PharmacyLayout title="Tableau de bord">
      <Head title="Tableau de bord - PharmaConnect Pharmacie" />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpiConfig.map((config) => {
          const value = kpis[config.key as keyof Kpis] ?? 0;
          const Icon = config.icon;
          return (
            <Link key={config.key} href={config.href}>
              <Card className="h-full overflow-hidden border-0 bg-white shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/60 transition-all hover:shadow-xl hover:ring-emerald-200/60">
                <CardContent className="p-0">
                  <div className="flex items-start justify-between p-5">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-500">{config.label}</p>
                      <p className="mt-1 font-display text-2xl font-bold tracking-tight text-slate-900">
                        {value}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">{config.description}</p>
                    </div>
                    <div
                      className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${config.bgClass} ${config.iconClass}`}
                    >
                      <Icon className="size-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="overflow-hidden border-0 bg-white shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/60 lg:col-span-2">
          <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-emerald-50/80 to-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-slate-800">
                  Dernières commandes
                </CardTitle>
                <CardDescription className="mt-0.5">
                  Commandes où votre pharmacie a été retenue
                </CardDescription>
              </div>
              <Button asChild variant="outline" size="sm" className="shrink-0">
                <Link href="/pharmacy/orders">
                  Voir tout
                  <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {recent_orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="size-12 text-slate-300" />
                <p className="mt-3 text-sm font-medium text-slate-600">Aucune commande pour l&apos;instant</p>
                <p className="mt-1 text-xs text-slate-500">
                  Les commandes apparaîtront ici une fois qu&apos;un client aura choisi votre offre.
                </p>
                <Button asChild className="mt-4">
                  <Link href="/pharmacy/requests">Répondre aux demandes</Link>
                </Button>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {recent_orders.map((order) => (
                  <li key={order.id}>
                    <Link
                      href={`/pharmacy/requests/${order.id}`}
                      className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-slate-50/80"
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-sm font-medium text-slate-500">#{order.id}</span>
                        <span className="font-medium text-slate-800">{order.client_name}</span>
                        <Badge
                          variant="default"
                          className={statusVariants[order.status] ?? 'bg-slate-100 text-slate-700'}
                        >
                          {statusLabels[order.status] ?? order.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-right">
                        {order.total_amount != null && (
                          <span className="text-sm font-semibold text-slate-700">
                            {Number(order.total_amount).toLocaleString('fr-FR')} FCFA
                          </span>
                        )}
                        <span className="text-xs text-slate-500">{formatDate(order.created_at)}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-0 bg-white shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/60">
          <CardHeader className="border-b border-slate-100 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 px-6 py-4">
            <CardTitle className="text-base font-semibold text-slate-800">
              Actions rapides
            </CardTitle>
            <CardDescription>
              Gérez vos demandes et commandes
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 p-4">
            <Button asChild className="w-full justify-start gap-3" size="lg">
              <Link href="/pharmacy/requests">
                <Inbox className="size-5" />
                Voir les demandes reçues
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start gap-3" size="lg">
              <Link href="/pharmacy/orders">
                <Package className="size-5" />
                Mes commandes
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </PharmacyLayout>
  );
}
