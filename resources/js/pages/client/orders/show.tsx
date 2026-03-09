import { Head, Link, usePage } from '@inertiajs/react';
import { MapPin, Truck, Package, Wallet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ClientLayout from '@/layouts/client-layout';
import { OrderChat } from '@/components/OrderChat';
import type { Order, OrderStatus, Message } from '@/types';

const methodLabels: Record<string, string> = {
  orange_money: 'Orange Money',
  moov_money: 'Moov Money',
  cash: 'À la livraison',
};

const statusLabels: Record<OrderStatus, string> = {
  pending: "En attente d'offres",
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

export default function ClientOrderShow({
  order,
  hasPaid,
  lastPayment,
  messages = [],
}: {
  order: Order;
  hasPaid?: boolean;
  lastPayment?: { method: string; transaction_ref?: string; paid_at?: string } | null;
  messages?: Message[];
}) {
  const canCompare = order.status === 'pending' || order.status === 'offers_received';
  const canPay = order.status === 'accepted' && order.chosen_offer_id && !hasPaid;
  const flash = (usePage().props as { flash?: { success?: string; error?: string; info?: string } }).flash;

  return (
    <ClientLayout title={`Commande #${order.id}`}>
      <Head title={`Commande #${order.id} - PharmaConnect`} />

      <div className="mt-6 max-w-3xl space-y-6">
        {flash?.success && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            {flash.success}
          </div>
        )}
        {flash?.error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {flash.error}
          </div>
        )}
        {flash?.info && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            {flash.info}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4">
          <Badge
            variant="default"
            className={statusVariants[order.status] ?? 'bg-slate-100 text-slate-700'}
          >
            {statusLabels[order.status as OrderStatus] ?? order.status}
          </Badge>
          <div className="flex gap-2">
            {canCompare && (
              <Button asChild>
                <Link href={`/client/orders/${order.id}/compare`}>Comparer les offres</Link>
              </Button>
            )}
            {canPay && (
              <Button asChild>
                <Link href={`/client/orders/${order.id}/pay`}>Payer</Link>
              </Button>
            )}
          </div>
        </div>

        {order.pickup_code && (
          <Card className="border-0 bg-emerald-50/60 shadow-md shadow-emerald-100 ring-1 ring-emerald-100">
            <CardContent className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                  Code de retrait
                </p>
                <p className="font-mono text-lg font-bold text-emerald-900">
                  {order.pickup_code}
                </p>
                <p className="mt-1 text-xs text-emerald-700/80">
                  Présentez ce code à la pharmacie pour récupérer votre commande.
                </p>
              </div>
              <p className="mt-2 text-xs text-emerald-700/80 sm:mt-0">
                Ne partagez ce code qu&apos;avec le personnel de la pharmacie.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          <Card className="overflow-hidden border-0 bg-white shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/60">
            <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
              <CardTitle className="text-base font-semibold text-slate-800">Détail de la commande</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-6">
              <p className="flex items-center gap-2 text-sm">
                <Package className="size-4 text-slate-400" />
                {order.type === 'prescription' ? "Photo d'ordonnance" : 'Liste'}
              </p>
              <p className="flex items-center gap-2 text-sm">
                <Truck className="size-4 text-slate-400" />
                {order.delivery_type === 'pickup' ? 'Retrait' : 'Livraison'}
              </p>
              {order.zone && (
                <p className="flex items-center gap-2 text-sm">
                  <MapPin className="size-4 text-slate-400" />
                  {order.zone}
                </p>
              )}
              {order.address && (
                <p className="text-sm text-slate-600">{order.address}</p>
              )}
            </CardContent>
          </Card>

          {order.items?.length ? (
            <Card className="overflow-hidden border-0 bg-white shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/60">
              <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
                <CardTitle className="text-base font-semibold text-slate-800">Médicaments</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-2">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex justify-between text-sm">
                      <span className="text-slate-700">{item.medicine_name}</span>
                      <span className="font-mono text-slate-600">× {item.quantity}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : null}
        </div>

        {order.chosen_offer && (
          <Card className="overflow-hidden border-0 bg-white shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/60">
            <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-primary/10 to-white px-6 py-4">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-800">
                <Wallet className="size-5 text-primary" />
                Offre retenue
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
              <div>
                <p className="font-display font-semibold text-slate-900">{order.chosen_offer.pharmacy?.name}</p>
                <p className="mt-1 font-mono text-xl font-bold text-primary">
                  {Number(order.total_amount ?? 0).toLocaleString('fr-FR')} FCFA
                </p>
                {hasPaid && lastPayment && (
                  <p className="mt-2 text-sm text-slate-500">
                    Payé par {methodLabels[lastPayment.method] ?? lastPayment.method}
                    {lastPayment.transaction_ref && ` · Ref. ${lastPayment.transaction_ref}`}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {order.chosen_offer_id && (
          <Card className="overflow-hidden border-0 bg-white shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/60">
            <CardHeader className="border-b border-slate-100 px-6 py-4">
              <CardTitle className="text-base font-semibold text-slate-800">Discussion avec la pharmacie</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <OrderChat
                messages={messages}
                postUrl={`/client/orders/${order.id}/messages`}
              />
            </CardContent>
          </Card>
        )}

        <p className="text-center">
          <Link href="/client/orders" className="text-sm font-medium text-primary hover:underline">
            ← Retour aux commandes
          </Link>
        </p>
      </div>
    </ClientLayout>
  );
}
