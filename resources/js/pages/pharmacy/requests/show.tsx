import { Head, Link, useForm } from '@inertiajs/react';
import { Send, MapPin, Truck, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PharmacyLayout from '@/layouts/pharmacy-layout';
import { OrderChat } from '@/components/OrderChat';
import type { Order, Offer, Message } from '@/types';

export default function PharmacyRequestShow({
  order,
  myOffer,
  messages = [],
  canChat = false,
}: {
  order: Order;
  myOffer: Offer | null;
  messages?: Message[];
  canChat?: boolean;
}) {
  const items = order.items ?? [];
  const defaultItems = items.length
    ? items.map((item) => ({
        order_item_id: item.id,
        unit_price: myOffer?.items?.find((oi: { order_item_id: number }) => oi.order_item_id === item.id)?.unit_price ?? 0,
        quantity: item.quantity,
        available: true,
      }))
    : [];

  const { data, setData, post, processing, errors } = useForm({
    total_price: myOffer?.total_price ?? 0,
    availability: (myOffer?.availability as 'full' | 'partial' | 'order') ?? 'full',
    delay_minutes: myOffer?.delay_minutes ?? 30,
    delivery_type: (myOffer?.delivery_type as 'pickup' | 'delivery') ?? order.delivery_type,
    delivery_fee: myOffer?.delivery_fee ?? 0,
    service_fee: myOffer?.service_fee ?? 0,
    notes: myOffer?.notes ?? '',
    items: defaultItems,
  });

  const updateTotal = () => {
    const total = data.items.reduce((s, i) => s + Number(i.unit_price) * Number(i.quantity), 0);
    setData('total_price', total + Number(data.delivery_fee) + Number(data.service_fee));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...data,
      total_price: data.items.reduce((s, i) => s + Number(i.unit_price) * Number(i.quantity), 0) + Number(data.delivery_fee) + Number(data.service_fee),
    };
    post(`/pharmacy/requests/${order.id}/offer`, payload);
  };

  return (
    <PharmacyLayout title={`Demande #${order.id}`}>
      <Head title={`Répondre à la demande #${order.id} - PharmaConnect`} />

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden border-0 bg-white shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/60">
          <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
            <CardTitle className="text-base font-semibold text-slate-800">Demande client</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="grid gap-3 text-sm">
              <p className="flex items-center gap-2">
                <MapPin className="size-4 text-slate-400" />
                <strong className="text-slate-600">Zone :</strong> {order.zone ?? '—'}
              </p>
              <p className="flex items-center gap-2">
                <Truck className="size-4 text-slate-400" />
                <strong className="text-slate-600">Livraison :</strong>{' '}
                {order.delivery_type === 'delivery' ? 'Livraison' : 'Retrait'}
              </p>
              <p className="flex items-center gap-2">
                <Clock className="size-4 text-slate-400" />
                <strong className="text-slate-600">Urgence :</strong>{' '}
                {order.urgency === 'express' ? 'Express' : 'Normal'}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">Médicaments demandés</p>
              <ul className="space-y-1.5 rounded-lg bg-slate-50 p-3 text-sm">
                {(order.items ?? []).map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>{item.medicine_name}</span>
                    <span className="font-medium text-slate-600">× {item.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-0 bg-white shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/60">
          <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-emerald-50/80 to-white px-6 py-4">
            <CardTitle className="text-base font-semibold text-slate-800">Votre offre</CardTitle>
            <p className="mt-0.5 text-sm text-slate-500">
              Indiquez les prix et options pour cette demande
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {(order.items ?? []).map((item, index) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3"
                >
                  <div className="min-w-[140px] flex-1">
                    <Label className="text-xs text-slate-600">{item.medicine_name}</Label>
                    <Input
                      type="number"
                      min={0}
                      step={0.01}
                      placeholder="Prix unit."
                      className="mt-1"
                      value={data.items[index]?.unit_price ?? ''}
                      onChange={(e) => {
                        const next = [...data.items];
                        next[index] = { ...next[index], unit_price: Number(e.target.value) };
                        setData('items', next);
                        updateTotal();
                      }}
                    />
                  </div>
                  <div className="w-20">
                    <Label className="text-xs text-slate-600">Qté</Label>
                    <Input
                      type="number"
                      min={1}
                      className="mt-1"
                      value={data.items[index]?.quantity ?? item.quantity}
                      onChange={(e) => {
                        const next = [...data.items];
                        next[index] = { ...next[index], quantity: Number(e.target.value) };
                        setData('items', next);
                        updateTotal();
                      }}
                    />
                  </div>
                  <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={data.items[index]?.available ?? true}
                      onChange={(e) => {
                        const next = [...data.items];
                        next[index] = { ...next[index], available: e.target.checked };
                        setData('items', next);
                      }}
                    />
                    Disponible
                  </label>
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-slate-600">Délai (min)</Label>
                  <Input
                    type="number"
                    min={0}
                    className="mt-1"
                    value={data.delay_minutes}
                    onChange={(e) => setData('delay_minutes', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label className="text-slate-600">Disponibilité</Label>
                  <select
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={data.availability}
                    onChange={(e) => setData('availability', e.target.value as 'full' | 'partial' | 'order')}
                  >
                    <option value="full">Tout disponible</option>
                    <option value="partial">Partiel</option>
                    <option value="order">Sur commande</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-slate-600">Type livraison</Label>
                  <select
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={data.delivery_type}
                    onChange={(e) => setData('delivery_type', e.target.value as 'pickup' | 'delivery')}
                  >
                    <option value="pickup">Retrait</option>
                    <option value="delivery">Livraison</option>
                  </select>
                </div>
                <div>
                  <Label className="text-slate-600">Frais livraison (FCFA)</Label>
                  <Input
                    type="number"
                    min={0}
                    className="mt-1"
                    value={data.delivery_fee}
                    onChange={(e) => {
                      setData('delivery_fee', Number(e.target.value));
                      updateTotal();
                    }}
                  />
                </div>
              </div>
              <div>
                <Label className="text-slate-600">Frais service (FCFA)</Label>
                <Input
                  type="number"
                  min={0}
                  className="mt-1"
                  value={data.service_fee}
                  onChange={(e) => {
                    setData('service_fee', Number(e.target.value));
                    updateTotal();
                  }}
                />
              </div>
              <div className="rounded-lg bg-emerald-50 p-3">
                <Label className="text-slate-600">Total (FCFA)</Label>
                <p className="mt-1 font-display text-xl font-bold text-emerald-700">
                  {Number(data.total_price || 0).toLocaleString('fr-FR')} FCFA
                </p>
              </div>
              {errors.total_price && (
                <p className="text-sm text-destructive">{errors.total_price}</p>
              )}
              <Button type="submit" className="w-full" disabled={processing}>
                <Send className="size-4" />
                {myOffer ? 'Mettre à jour mon offre' : 'Envoyer mon offre'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {canChat && (
        <Card className="mt-8 overflow-hidden border-0 bg-white shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/60">
          <CardHeader className="border-b border-slate-100 px-6 py-4">
            <CardTitle className="text-base font-semibold text-slate-800">Discussion avec le client</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <OrderChat
              messages={messages}
              postUrl={`/pharmacy/requests/${order.id}/messages`}
              show={canChat}
            />
          </CardContent>
        </Card>
      )}
    </PharmacyLayout>
  );
}
