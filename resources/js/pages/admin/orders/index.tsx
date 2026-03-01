import { Head, Link } from '@inertiajs/react';
import {
  FileText,
  Calendar,
  ShoppingCart,
  Clock,
  CheckCircle2,
  Banknote,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/layouts/admin-layout';
import type { Order } from '@/types';

type AdminOrder = Order & {
  client?: { user?: { name?: string; email?: string } };
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

interface Stats {
  total: number;
  pending: number;
  completed: number;
  revenue: number;
}

interface PaginatedOrders {
  data: AdminOrder[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  links?: { url: string | null; label: string; active: boolean }[];
}

const statCards = [
  {
    key: 'total' as const,
    label: 'Total commandes',
    icon: ShoppingCart,
    bg: 'bg-slate-100',
    iconColor: 'text-slate-600',
    valueFormat: (v: number) => v.toLocaleString('fr-FR'),
  },
  {
    key: 'pending' as const,
    label: 'En attente',
    icon: Clock,
    bg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    valueFormat: (v: number) => v.toLocaleString('fr-FR'),
  },
  {
    key: 'completed' as const,
    label: 'Terminées',
    icon: CheckCircle2,
    bg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    valueFormat: (v: number) => v.toLocaleString('fr-FR'),
  },
  {
    key: 'revenue' as const,
    label: 'Revenus encaissés',
    icon: Banknote,
    bg: 'bg-primary/10',
    iconColor: 'text-primary',
    valueFormat: (v: number) => `${v.toLocaleString('fr-FR')} FCFA`,
  },
];

export default function AdminOrdersIndex({
  orders,
  stats = { total: 0, pending: 0, completed: 0, revenue: 0 },
}: {
  orders: PaginatedOrders;
  stats?: Stats;
}) {
  const { data: list, last_page, total, links } = orders;

  return (
    <AdminLayout title="Commandes">
      <Head title="Commandes - Admin PharmaConnect" />

      {/* Statistiques en haut */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ key, label, icon: Icon, bg, iconColor, valueFormat }) => (
          <Card
            key={key}
            className="overflow-hidden border-0 bg-white shadow-md shadow-slate-200/40 ring-1 ring-slate-200/50 transition-shadow hover:shadow-lg"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    {label}
                  </p>
                  <p className="mt-1 font-display text-xl font-bold tracking-tight text-slate-900">
                    {valueFormat(stats[key] ?? 0)}
                  </p>
                </div>
                <div className={`flex size-11 items-center justify-center rounded-xl ${bg} ${iconColor}`}>
                  <Icon className="size-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Liste des commandes */}
      <Card className="mt-8 overflow-hidden border-0 bg-white shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/60">
        <CardHeader className="border-b border-slate-100 bg-gradient-to-br from-slate-50 via-white to-slate-50/50 px-6 py-5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                <FileText className="size-5 text-primary" />
                Toutes les commandes
              </CardTitle>
              <p className="mt-1 text-sm text-slate-500">
                {total} commande{total !== 1 ? 's' : ''} · Page courante
              </p>
            </div>
            <Link
              href="/admin"
              className="mt-2 text-sm font-medium text-primary hover:underline sm:mt-0"
            >
              ← Tableau de bord
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {list.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex size-20 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <FileText className="size-10" />
              </div>
              <p className="mt-5 text-base font-medium text-slate-700">Aucune commande</p>
              <p className="mt-1 text-sm text-slate-500">
                Les commandes apparaîtront ici lorsqu'elles seront créées.
              </p>
              <Link
                href="/admin"
                className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
              >
                Retour au tableau de bord
              </Link>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80">
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        N° · Client
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Pharmacie
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Statut
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Montant
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {list.map((order, index) => (
                      <tr
                        key={order.id}
                        className={`transition-colors hover:bg-slate-50/80 ${
                          index % 2 === 1 ? 'bg-slate-50/30' : ''
                        }`}
                      >
                        <td className="px-6 py-4">
                          <Link
                            href={`/admin/orders?highlight=${order.id}`}
                            className="font-semibold text-primary hover:underline"
                          >
                            #{order.id}
                          </Link>
                          <div className="mt-0.5 font-medium text-slate-800">
                            {order.client?.user?.name ?? '—'}
                          </div>
                          {order.client?.user?.email && (
                            <span className="text-xs text-slate-500">
                              {order.client.user.email}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-slate-700">
                          <span className="font-medium">
                            {order.chosen_offer?.pharmacy?.name ?? '—'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={
                              order.status in statusLabels
                                ? (order.status as
                                    | 'pending'
                                    | 'completed'
                                    | 'accepted'
                                    | 'cancelled'
                                    | 'preparing'
                                    | 'ready'
                                    | 'in_delivery'
                                    | 'offers_received')
                                : 'default'
                            }
                            className="rounded-md font-medium"
                          >
                            {statusLabels[order.status] ?? order.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-mono font-semibold text-slate-800">
                            {order.total_amount != null
                              ? `${Number(order.total_amount).toLocaleString('fr-FR')} FCFA`
                              : '—'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                            <Calendar className="size-3.5 text-slate-400" />
                            {new Date(order.created_at).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {last_page > 1 && links && links.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-2 border-t border-slate-200 bg-slate-50/50 px-6 py-4">
                  {links.map((link, i) => (
                    <span key={i}>
                      {link.url ? (
                        <Link
                          href={link.url}
                          className={`inline-flex min-w-9 justify-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                            link.active
                              ? 'bg-primary text-white shadow-sm'
                              : 'text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                        </Link>
                      ) : (
                        <span className="inline-flex min-w-9 justify-center rounded-lg px-3 py-2 text-sm text-slate-400">
                          {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
