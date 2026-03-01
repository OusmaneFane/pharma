import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { PhoneInput } from '@/components/ui/phone-input';
import ClientLayout from '@/layouts/client-layout';
import type { Order } from '@/types';

interface MethodOption {
  id: string;
  label: string;
  phone_required: boolean;
}

export default function ClientOrderPay({
  order,
  amount,
  methods,
}: {
  order: Order;
  amount: number;
  methods: MethodOption[];
}) {
  const [phone, setPhone] = useState('');
  const { data, setData, post, processing, errors } = useForm({
    method: 'orange_money',
    phone: '',
  });

  const selectedMethod = methods.find((m) => m.id === data.method);

  return (
    <ClientLayout title={`Payer la commande #${order.id}`}>
      <Head title={`Paiement - Commande #${order.id} - PharmaConnect`} />
      <div className="mt-6 max-w-md space-y-6">
        <Card className="overflow-hidden border-0 bg-white shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/60">
          <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-primary/5 to-white px-6 py-4">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Wallet className="size-5 text-primary" />
              Paiement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <p className="font-mono text-2xl font-semibold text-primary">
              {amount.toLocaleString('fr-FR')} FCFA
            </p>
            <p className="text-sm text-muted-foreground">
              Commande #{order.id} · {order.chosen_offer?.pharmacy?.name}
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                post(`/client/orders/${order.id}/pay`);
              }}
              className="space-y-4"
            >
              <div>
                <Label>Mode de paiement</Label>
                <div className="mt-2 space-y-2">
                  {methods.map((m) => (
                    <label
                      key={m.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-3 transition-colors ${
                        data.method === m.id ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                    >
                      <input
                        type="radio"
                        name="method"
                        value={m.id}
                        checked={data.method === m.id}
                        onChange={() => setData('method', m.id)}
                        className="sr-only"
                      />
                      <span className="font-medium">{m.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {selectedMethod?.phone_required && (
                <div>
                  <Label>Téléphone (Mali +223)</Label>
                  <PhoneInput
                    value={phone}
                    onChange={(_, full) => {
                      setPhone(full);
                      setData('phone', full);
                    }}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Vous recevrez une demande de paiement sur ce numéro.
                  </p>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-destructive">{errors.phone}</p>
                  )}
                </div>
              )}

              {errors.method && (
                <p className="text-sm text-destructive">{errors.method}</p>
              )}

              <div className="flex gap-3">
                <Button type="button" variant="outline" asChild>
                  <Link href={`/client/orders/${order.id}`}>Annuler</Link>
                </Button>
                <Button type="submit" disabled={processing} className="flex-1">
                  {processing ? 'Traitement…' : 'Payer'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
}
