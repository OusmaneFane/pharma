import { Head, Link } from '@inertiajs/react';
import {
  BarChart3,
  ShoppingCart,
  Banknote,
  Building2,
  Activity,
  TrendingUp,
  PieChart as PieChartIcon,
  Award,
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';

const STATUS_COLORS = [
  '#0F7B6C',
  '#8B5CF6',
  '#F59E0B',
  '#3B82F6',
  '#10B981',
  '#6366F1',
  '#EF4444',
  '#EC4899',
];

interface ChartDay {
  date: string;
  label: string;
  orders?: number;
  revenue?: number;
}

interface ChartMonth {
  month: string;
  label: string;
  orders: number;
  revenue: number;
}

interface ChartStatusItem {
  name: string;
  value: number;
  status: string;
}

interface TopPharmacy {
  pharmacy_name: string;
  orders_count: number;
  total_revenue: number;
}

interface AnalyticsProps {
  kpis?: {
    total_orders: number;
    total_revenue: number;
    total_pharmacies: number;
    orders_this_month: number;
  };
  chart_orders_per_day?: ChartDay[];
  chart_revenue_per_day?: ChartDay[];
  chart_orders_per_month?: ChartMonth[];
  chart_status_data?: ChartStatusItem[];
  top_pharmacies?: TopPharmacy[];
}

const kpiCards = [
  {
    key: 'total_orders' as const,
    label: 'Total commandes',
    icon: ShoppingCart,
    bg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-600',
    format: (v: number) => v.toLocaleString('fr-FR'),
  },
  {
    key: 'total_revenue' as const,
    label: 'Revenus totaux',
    icon: Banknote,
    bg: 'bg-amber-500/10',
    iconColor: 'text-amber-600',
    format: (v: number) => `${v.toLocaleString('fr-FR')} FCFA`,
  },
  {
    key: 'total_pharmacies' as const,
    label: 'Pharmacies actives',
    icon: Building2,
    bg: 'bg-violet-500/10',
    iconColor: 'text-violet-600',
    format: (v: number) => v.toLocaleString('fr-FR'),
  },
  {
    key: 'orders_this_month' as const,
    label: 'Commandes ce mois',
    icon: Activity,
    bg: 'bg-blue-500/10',
    iconColor: 'text-blue-600',
    format: (v: number) => v.toLocaleString('fr-FR'),
  },
];

export default function AdminAnalytics({
  kpis = { total_orders: 0, total_revenue: 0, total_pharmacies: 0, orders_this_month: 0 },
  chart_orders_per_day = [],
  chart_revenue_per_day = [],
  chart_orders_per_month = [],
  chart_status_data = [],
  top_pharmacies = [],
}: AnalyticsProps) {
  return (
    <AdminLayout title="Analytics">
      <Head title="Analytics - Admin PharmaConnect" />

      {/* KPIs */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map(({ key, label, icon: Icon, bg, iconColor, format }) => (
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
                    {format(kpis[key] ?? 0)}
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

      {/* Commandes sur 30 jours */}
      <Card className="mt-8 overflow-hidden border-0 bg-white shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/60">
        <CardHeader className="border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white px-6 py-4">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-800">
            <Activity className="size-5 text-primary" />
            Commandes sur 30 jours
          </CardTitle>
          <p className="mt-1 text-xs text-slate-500">
            Évolution quotidienne du nombre de commandes
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[300px] w-full">
            {chart_orders_per_day.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chart_orders_per_day} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="analyticsOrdersGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0F7B6C" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#0F7B6C" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                    formatter={(value: number | undefined) => [value ?? 0, 'Commandes']}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.date
                        ? new Date(payload[0].payload.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })
                        : ''
                    }
                  />
                  <Area type="monotone" dataKey="orders" name="Commandes" stroke="#0F7B6C" strokeWidth={2} fill="url(#analyticsOrdersGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center rounded-lg bg-slate-50 text-sm text-slate-500">
                Aucune donnée
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Revenus 30 jours + Répartition par statut */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden border-0 bg-white shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/60">
          <CardHeader className="border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white px-6 py-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-800">
              <Banknote className="size-5 text-amber-600" />
              Revenus sur 30 jours
            </CardTitle>
            <p className="mt-1 text-xs text-slate-500">Chiffre d'affaires encaissé par jour (FCFA)</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[280px] w-full">
              {chart_revenue_per_day.length > 0 && chart_revenue_per_day.some((d) => (d.revenue ?? 0) > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chart_revenue_per_day} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                      formatter={(value: number | undefined) => [`${Number(value ?? 0).toLocaleString('fr-FR')} FCFA`, 'Revenus']}
                      labelFormatter={(_, payload) =>
                        payload?.[0]?.payload?.date ? new Date(payload[0].payload.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }) : ''
                      }
                    />
                    <Bar dataKey="revenue" name="Revenus" fill="#F59E0B" radius={[4, 4, 0, 0]} maxBarSize={36} />
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

        <Card className="overflow-hidden border-0 bg-white shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/60">
          <CardHeader className="border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white px-6 py-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-800">
              <PieChartIcon className="size-5 text-violet-600" />
              Répartition par statut
            </CardTitle>
            <p className="mt-1 text-xs text-slate-500">Vue d'ensemble des statuts des commandes</p>
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
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={2}
                      label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                      labelLine={{ stroke: '#94a3b8', strokeWidth: 1 }}
                    >
                      {chart_status_data.map((_, index) => (
                        <Cell key={index} fill={STATUS_COLORS[index % STATUS_COLORS.length]} stroke="white" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                      formatter={(value: number | undefined, name: string | undefined) => [`${value ?? 0} commande${(value ?? 0) > 1 ? 's' : ''}`, name ?? '']}
                    />
                    <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ fontSize: 11 }} iconSize={8} iconType="circle" />
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
      </div>

      {/* Tendances 6 mois + Top pharmacies */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden border-0 bg-white shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/60">
          <CardHeader className="border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white px-6 py-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-800">
              <TrendingUp className="size-5 text-primary" />
              Tendances — 6 derniers mois
            </CardTitle>
            <p className="mt-1 text-xs text-slate-500">Commandes et revenus par mois</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[280px] w-full">
              {chart_orders_per_month.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chart_orders_per_month} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                    <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                      formatter={(value: number | undefined, name: string | undefined) => [
                        name === 'Commandes' ? (value ?? 0) : `${Number(value ?? 0).toLocaleString('fr-FR')} FCFA`,
                        name ?? '',
                      ]}
                    />
                    <Bar yAxisId="left" dataKey="orders" name="Commandes" fill="#0F7B6C" radius={[4, 4, 0, 0]} maxBarSize={48} />
                    <Bar yAxisId="right" dataKey="revenue" name="Revenus" fill="#F59E0B" radius={[4, 4, 0, 0]} maxBarSize={48} />
                    <Legend />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center rounded-lg bg-slate-50 text-sm text-slate-500">
                  Aucune donnée
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-0 bg-white shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/60">
          <CardHeader className="border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white px-6 py-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-800">
              <Award className="size-5 text-amber-600" />
              Top 5 pharmacies
            </CardTitle>
            <p className="mt-1 text-xs text-slate-500">Par nombre de commandes gagnées</p>
          </CardHeader>
          <CardContent className="p-6">
            {top_pharmacies.length > 0 ? (
              <div className="space-y-3">
                {top_pharmacies.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 font-display text-sm font-bold text-primary">
                        {i + 1}
                      </span>
                      <span className="font-medium text-slate-800">{p.pharmacy_name}</span>
                    </div>
                    <div className="text-right text-sm">
                      <span className="font-semibold text-slate-900">{p.orders_count} commandes</span>
                      <span className="block text-xs text-slate-500">
                        {p.total_revenue.toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center text-sm text-slate-500">
                Aucune pharmacie avec commande acceptée
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Link href="/admin" className="text-sm font-medium text-primary hover:underline">
          ← Tableau de bord
        </Link>
      </div>
    </AdminLayout>
  );
}
