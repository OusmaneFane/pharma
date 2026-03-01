import { Head, Link } from '@inertiajs/react';
import {
  ShoppingCart,
  Users,
  TrendingUp,
  Banknote,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  PieChart as PieChartIcon,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/layouts/admin-layout';

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

const STATUS_COLORS = [
  '#0F7B6C', // primary
  '#8B5CF6', // violet
  '#F59E0B', // amber
  '#3B82F6', // blue
  '#10B981', // emerald
  '#6366F1', // indigo
  '#EF4444', // red
  '#EC4899', // pink
];

interface Kpis {
  total_orders: number;
  orders_this_month: number;
  orders_growth: number;
  total_pharmacies: number;
  verified_pharmacies: number;
  total_clients: number;
  revenue: number;
  revenue_this_month: number;
  revenue_growth: number;
}

interface RecentOrder {
  id: number;
  status: string;
  client_name: string;
  pharmacy_name: string;
  total_amount: number | null;
  created_at: string;
}

interface ChartDay {
  date: string;
  label: string;
  orders?: number;
  revenue?: number;
}

interface ChartStatusItem {
  name: string;
  value: number;
  status: string;
}

const kpiConfig = [
  {
    key: 'orders' as const,
    label: 'Commandes (ce mois)',
    valueKey: 'orders_this_month',
    subKey: 'orders_growth',
    subLabel: 'Total',
    totalKey: 'total_orders',
    icon: ShoppingCart,
    lightBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-600',
  },
  {
    key: 'pharmacies' as const,
    label: 'Pharmacies',
    valueKey: 'total_pharmacies',
    subKey: null,
    subLabel: 'vérifiées',
    totalKey: 'verified_pharmacies',
    icon: Building2,
    lightBg: 'bg-violet-500/10',
    iconColor: 'text-violet-600',
  },
  {
    key: 'clients' as const,
    label: 'Clients',
    valueKey: 'total_clients',
    subKey: null,
    subLabel: null,
    totalKey: null,
    icon: Users,
    lightBg: 'bg-blue-500/10',
    iconColor: 'text-blue-600',
  },
  {
    key: 'revenue' as const,
    label: 'Revenus (ce mois)',
    valueKey: 'revenue_this_month',
    subKey: 'revenue_growth',
    subLabel: 'Total',
    totalKey: 'revenue',
    icon: Banknote,
    lightBg: 'bg-amber-500/10',
    iconColor: 'text-amber-600',
    format: (v: number) => `${Number(v).toLocaleString('fr-FR')} FCFA`,
  },
];

export default function AdminDashboard({
  kpis,
  orders_by_status,
  recent_orders,
  chart_orders_per_day = [],
  chart_revenue_per_day = [],
  chart_status_data = [],
}: {
  kpis: Kpis;
  orders_by_status: Record<string, number>;
  recent_orders: RecentOrder[];
  chart_orders_per_day?: ChartDay[];
  chart_revenue_per_day?: ChartDay[];
  chart_status_data?: ChartStatusItem[];
}) {
  return (
    <AdminLayout title="Tableau de bord">
      <Head title="Admin - PharmaConnect" />

      {/* KPI cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpiConfig.map((config) => {
          const value =
            config.key === 'revenue' && config.format
              ? config.format(kpis[config.valueKey as keyof Kpis] as number)
              : String(kpis[config.valueKey as keyof Kpis] ?? 0);
          const growth = config.subKey
            ? (kpis[config.subKey as keyof Kpis] as number) ?? 0
            : null;
          const total = config.totalKey
            ? (kpis[config.totalKey as keyof Kpis] as number) ?? 0
            : null;
          const Icon = config.icon;

          return (
            <Card
              key={config.key}
              className="overflow-hidden border-0 bg-white shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/60 transition-all hover:shadow-xl hover:ring-slate-300/50"
            >
              <CardContent className="p-0">
                <div className="flex items-start justify-between p-5">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-500">{config.label}</p>
                    <p className="mt-1 font-display text-2xl font-bold tracking-tight text-slate-900">
                      {value}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-0 text-xs text-slate-500">
                      {growth !== null && (
                        <span
                          className={`inline-flex items-center gap-0.5 font-medium ${
                            growth >= 0 ? 'text-emerald-600' : 'text-red-600'
                          }`}
                        >
                          {growth >= 0 ? (
                            <ArrowUpRight className="size-3.5" />
                          ) : (
                            <ArrowDownRight className="size-3.5" />
                          )}
                          {growth >= 0 ? '+' : ''}
                          {growth} % vs mois dernier
                        </span>
                      )}
                      {total !== null && config.subLabel && (
                        <>
                          <span className="text-slate-300">·</span>
                          <span>
                            {config.subLabel} {total}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div
                    className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${config.lightBg} ${config.iconColor}`}
                  >
                    <Icon className="size-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Commandes sur 14 jours — Area */}
        <Card className="overflow-hidden border-0 bg-white shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/60">
          <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-800">
              <Activity className="size-5 text-primary" />
              Commandes sur 14 jours
            </CardTitle>
            <p className="mt-1 text-xs text-slate-500">
              Évolution du nombre de commandes créées par jour
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[280px] w-full">
              {chart_orders_per_day.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chart_orders_per_day}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0F7B6C" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#0F7B6C" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      axisLine={{ stroke: '#e2e8f0' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      }}
                      labelStyle={{ fontWeight: 600 }}
                      formatter={(value: number | undefined) => [value ?? 0, 'Commandes']}
                      labelFormatter={(_, payload) =>
                        payload?.[0]?.payload?.date
                          ? new Date(payload[0].payload.date).toLocaleDateString('fr-FR', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short',
                            })
                          : ''
                      }
                    />
                    <Area
                      type="monotone"
                      dataKey="orders"
                      name="Commandes"
                      stroke="#0F7B6C"
                      strokeWidth={2}
                      fill="url(#ordersGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center rounded-lg bg-slate-50 text-sm text-slate-500">
                  Aucune donnée sur la période
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Revenus sur 14 jours — Bar */}
        <Card className="overflow-hidden border-0 bg-white shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/60">
          <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-800">
              <Banknote className="size-5 text-amber-600" />
              Revenus sur 14 jours
            </CardTitle>
            <p className="mt-1 text-xs text-slate-500">
              Chiffre d'affaires encaissé par jour (FCFA)
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[280px] w-full">
              {chart_revenue_per_day.length > 0 &&
              chart_revenue_per_day.some((d) => (d.revenue ?? 0) > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chart_revenue_per_day}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      axisLine={{ stroke: '#e2e8f0' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      }}
                      formatter={(value: number | undefined) => [
                        `${Number(value ?? 0).toLocaleString('fr-FR')} FCFA`,
                        'Revenus',
                      ]}
                      labelFormatter={(_, payload) =>
                        payload?.[0]?.payload?.date
                          ? new Date(payload[0].payload.date).toLocaleDateString('fr-FR', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short',
                            })
                          : ''
                      }
                    />
                    <Bar
                      dataKey="revenue"
                      name="Revenus"
                      fill="#F59E0B"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={48}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center rounded-lg bg-slate-50 text-sm text-slate-500">
                  Aucun revenu sur la période
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Répartition par statut (Pie) + Dernières commandes */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden border-0 bg-white shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/60">
          <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-800">
              <PieChartIcon className="size-5 text-violet-600" />
              Répartition des commandes par statut
            </CardTitle>
            <p className="mt-1 text-xs text-slate-500">
              Vue d'ensemble des statuts actuels
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mx-auto h-[280px] w-full max-w-[320px]">
              {chart_status_data.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chart_status_data}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={64}
                      outerRadius={100}
                      paddingAngle={2}
                      label={({ name, percent }) =>
                        `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                      }
                      labelLine={{ stroke: '#94a3b8', strokeWidth: 1 }}
                    >
                      {chart_status_data.map((_, index) => (
                        <Cell
                          key={index}
                          fill={STATUS_COLORS[index % STATUS_COLORS.length]}
                          stroke="white"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      }}
                      formatter={(value: number | undefined, name: string | undefined) => [
                        `${value ?? 0} commande${(value ?? 0) > 1 ? 's' : ''}`,
                        name ?? '',
                      ]}
                    />
                    <Legend
                      layout="vertical"
                      align="right"
                      verticalAlign="middle"
                      wrapperStyle={{ fontSize: 11 }}
                      iconSize={8}
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center rounded-lg bg-slate-50 text-sm text-slate-500">
                  Aucune commande
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-0 bg-white shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/60">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-800">
              <TrendingUp className="size-5 text-primary" />
              Dernières commandes
            </CardTitle>
            <Button asChild variant="outline" size="sm" className="rounded-lg border-slate-200">
              <Link href="/admin/orders">Voir tout</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Pharmacie
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Montant
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recent_orders.map((o) => (
                    <tr key={o.id} className="transition-colors hover:bg-slate-50/80">
                      <td className="whitespace-nowrap px-6 py-4">
                        <Link
                          href={`/admin/orders?highlight=${o.id}`}
                          className="font-medium text-primary hover:underline"
                        >
                          #{o.id}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-slate-700">{o.client_name}</td>
                      <td className="px-6 py-4 text-slate-700">{o.pharmacy_name}</td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            o.status in statusLabels
                              ? (o.status as
                                  | 'pending'
                                  | 'completed'
                                  | 'accepted'
                                  | 'cancelled')
                              : 'default'
                          }
                          className="rounded-md"
                        >
                          {statusLabels[o.status] ?? o.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-medium text-slate-800">
                        {o.total_amount != null
                          ? `${Number(o.total_amount).toLocaleString('fr-FR')} FCFA`
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {recent_orders.length === 0 && (
                <div className="py-12 text-center text-slate-500">
                  Aucune commande récente.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
