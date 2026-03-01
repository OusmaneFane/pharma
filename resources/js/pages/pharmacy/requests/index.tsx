import { Head, Link } from '@inertiajs/react';
import { Inbox, MapPin, Package, FileText, ClipboardList, FileSignature } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PharmacyLayout from '@/layouts/pharmacy-layout';
import type { Order } from '@/types';

interface RequestStats {
  total: number;
  prescription: number;
  list: number;
}

const statCards: { key: keyof RequestStats; label: string; icon: typeof Inbox; bg: string; iconColor: string }[] = [
  { key: 'total', label: 'Total demandes', icon: Inbox, bg: 'bg-emerald-100', iconColor: 'text-emerald-600' },
  { key: 'prescription', label: 'Ordonnances', icon: FileSignature, bg: 'bg-violet-100', iconColor: 'text-violet-600' },
  { key: 'list', label: 'Listes', icon: ClipboardList, bg: 'bg-amber-100', iconColor: 'text-amber-600' },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function PharmacyRequestsIndex({
  requests,
  stats = { total: 0, prescription: 0, list: 0 },
}: {
  requests: {
    data: Order[];
    current_page: number;
    last_page: number;
    links?: { url: string | null; label: string; active: boolean }[];
  };
  stats?: RequestStats;
}) {
  const list = requests?.data ?? [];
  const hasPages = requests.last_page > 1;
  const links = requests.links ?? [];

  return (
    <PharmacyLayout title="Demandes reçues">
      <Head title="Demandes reçues - PharmaConnect" />

      {/* Statistiques */}
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

      <div className="mt-8 flex flex-col gap-6">
        {list.length === 0 ? (
          <Card className="border-0 bg-white shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/60">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-emerald-100">
                <Inbox className="size-8 text-emerald-600" />
              </div>
              <h2 className="mt-4 font-display text-lg font-semibold text-slate-800">
                Aucune demande pour le moment
              </h2>
              <p className="mt-2 max-w-sm text-sm text-slate-500">
                Les nouvelles demandes des clients apparaîtront ici. Vous pourrez y répondre en proposant une offre.
              </p>
              <Button asChild className="mt-6">
                <Link href="/pharmacy">Retour au tableau de bord</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((order: Order) => (
                <Link key={order.id} href={`/pharmacy/requests/${order.id}`}>
                  <Card className="h-full overflow-hidden border-0 bg-white shadow-md shadow-slate-200/50 ring-1 ring-slate-200/60 transition-all hover:shadow-lg hover:ring-emerald-200/60">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-mono text-sm font-semibold text-emerald-600">
                          #{order.id}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                          {order.type === 'prescription' ? 'Ordonnance' : 'Liste'}
                        </span>
                      </div>
                      <div className="mt-3 space-y-2 text-sm text-slate-600">
                        {order.zone && (
                          <p className="flex items-center gap-2">
                            <MapPin className="size-4 shrink-0 text-slate-400" />
                            {order.zone}
                          </p>
                        )}
                        <p className="flex items-center gap-2">
                          <Package className="size-4 shrink-0 text-slate-400" />
                          {order.items?.length ?? 0} médicament(s)
                        </p>
                        <p className="flex items-center gap-2 text-xs text-slate-500">
                          <FileText className="size-3.5 shrink-0" />
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                      <p className="mt-4 text-sm font-medium text-emerald-600">
                        Répondre à la demande →
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {hasPages && links.length > 0 && (
              <nav className="flex flex-wrap items-center justify-center gap-2">
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
      </div>
    </PharmacyLayout>
  );
}
