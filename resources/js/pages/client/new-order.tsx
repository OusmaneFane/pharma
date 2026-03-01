import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, ListChecks, ChevronRight, ChevronLeft, Send } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ProgressBar } from '@/components/ui/progress-bar';
import ClientLayout from '@/layouts/client-layout';
import { MedicineList } from '@/components/client/MedicineList';
import { PrescriptionUpload } from '@/components/client/PrescriptionUpload';

const steps = [
  { id: 1, title: 'Type de demande', icon: Camera },
  { id: 2, title: 'Préférences', icon: ListChecks },
  { id: 3, title: 'Confirmation', icon: Send },
];

const schema = z.object({
  type: z.enum(['prescription', 'list']),
  prescription_path: z.string().optional(),
  prescription_file: z.any().optional().nullable(),
  notes: z.string().max(1000).optional(),
  zone: z.string().max(100).optional(),
  address: z.string().max(255).optional(),
  accepts_generics: z.boolean(),
  accepts_substitution: z.boolean(),
  accepts_partial: z.boolean(),
  delivery_type: z.enum(['pickup', 'delivery']),
  urgency: z.enum(['normal', 'express']),
  items: z.array(z.object({
    medicine_name: z.string().min(1, 'Requis'),
    quantity: z.number().min(1),
    dosage: z.string().optional(),
    notes: z.string().optional(),
  })).optional(),
}).refine((data) => {
  if (data.type === 'list') {
    const filled = data.items?.filter((i) => i.medicine_name?.trim()) ?? [];
    return filled.length > 0;
  }
  if (data.type === 'prescription') return true;
  return false;
}, { message: 'Ajoutez au moins un médicament ou une photo.', path: ['items'] });

type FormValues = z.infer<typeof schema>;

const defaultValues: FormValues = {
  type: 'list',
  notes: '',
  zone: '',
  address: '',
  accepts_generics: true,
  accepts_substitution: false,
  accepts_partial: false,
  delivery_type: 'pickup',
  urgency: 'normal',
  items: [{ medicine_name: '', quantity: 1, dosage: '', notes: '' }],
};

export default function ClientNewOrder() {
  const [step, setStep] = useState(1);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onTouched',
  });

  const { handleSubmit, watch, setValue, trigger, formState: { errors, isSubmitting } } = form;
  const type = watch('type');
  const deliveryType = watch('delivery_type');

  const canNextStep = async () => {
    if (step === 1) {
      const ok = await trigger(['type', 'prescription_path', 'prescription_file', 'items']);
      return ok;
    }
    if (step === 2) {
      return await trigger(['delivery_type', 'urgency', 'zone', 'address']);
    }
    return true;
  };

  const onNext = async () => {
    const ok = await canNextStep();
    if (ok && step < 3) setStep((s) => s + 1);
  };

  const onBack = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const onSubmit = (data: FormValues) => {
    const url = '/client/orders';
    const items =
      data.type === 'list'
        ? (data.items ?? []).filter((i) => i.medicine_name?.trim()).map((i) => ({
            medicine_name: i.medicine_name.trim(),
            quantity: i.quantity,
            dosage: i.dosage || undefined,
            notes: i.notes || undefined,
          }))
        : [];
    const payload: Record<string, unknown> = {
      type: data.type,
      prescription_path: data.prescription_path || null,
      notes: data.notes || null,
      zone: data.zone || null,
      address: data.address || null,
      accepts_generics: data.accepts_generics,
      accepts_substitution: data.accepts_substitution,
      accepts_partial: data.accepts_partial,
      delivery_type: data.delivery_type,
      urgency: data.urgency,
      items,
    };
    if (data.type === 'prescription' && data.prescription_file) {
      router.post(url, { ...payload, prescription: data.prescription_file }, { forceFormData: true });
    } else {
      router.post(url, payload);
    }
  };

  return (
    <ClientLayout title="Nouvelle demande">
      <Head title="Nouvelle demande - PharmaConnect" />

      <div className="mt-6 w-full max-w-none space-y-6">
        <ProgressBar value={(step / 3) * 100} max={100} showLabel className="mb-6" />

        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="size-5" />
                      Étape 1 — Type de demande
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setValue('type', 'prescription')}
                        className={`rounded-xl border-2 p-4 text-left transition-all ${
                          type === 'prescription'
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <span className="text-2xl">📷</span>
                        <span className="font-display font-semibold block mt-1">Photo d&apos;ordonnance</span>
                        <span className="text-xs text-muted-foreground">Envoyez une photo</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setValue('type', 'list')}
                        className={`rounded-xl border-2 p-4 text-left transition-all ${
                          type === 'list'
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <span className="text-2xl">✏️</span>
                        <span className="font-display font-semibold block mt-1">Liste de médicaments</span>
                        <span className="text-xs text-muted-foreground">Saisie manuelle</span>
                      </button>
                    </div>

                    {type === 'prescription' && <PrescriptionUpload />}
                    {type === 'list' && <MedicineList />}

                    {errors.items && (
                      <p className="text-sm text-destructive" role="alert">{errors.items.message}</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ListChecks className="size-5" />
                      Étape 2 — Préférences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="accepts_generics"
                          checked={watch('accepts_generics')}
                          onCheckedChange={(v) => setValue('accepts_generics', !!v)}
                        />
                        <Label htmlFor="accepts_generics">J&apos;accepte les génériques</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="accepts_substitution"
                          checked={watch('accepts_substitution')}
                          onCheckedChange={(v) => setValue('accepts_substitution', !!v)}
                        />
                        <Label htmlFor="accepts_substitution">J&apos;accepte une substitution</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="accepts_partial"
                          checked={watch('accepts_partial')}
                          onCheckedChange={(v) => setValue('accepts_partial', !!v)}
                        />
                        <Label htmlFor="accepts_partial">J&apos;accepte une commande partielle</Label>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setValue('delivery_type', 'pickup')}
                        className={`rounded-lg border-2 p-3 text-left text-sm ${
                          deliveryType === 'pickup' ? 'border-primary bg-primary/5' : 'border-border'
                        }`}
                      >
                        Retrait en pharmacie
                      </button>
                      <button
                        type="button"
                        onClick={() => setValue('delivery_type', 'delivery')}
                        className={`rounded-lg border-2 p-3 text-left text-sm ${
                          deliveryType === 'delivery' ? 'border-primary bg-primary/5' : 'border-border'
                        }`}
                      >
                        Livraison à domicile
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setValue('urgency', 'normal')}
                        className={`rounded-lg border-2 p-3 text-sm ${
                          watch('urgency') === 'normal' ? 'border-primary bg-primary/5' : 'border-border'
                        }`}
                      >
                        Normal
                      </button>
                      <button
                        type="button"
                        onClick={() => setValue('urgency', 'express')}
                        className={`rounded-lg border-2 p-3 text-sm ${
                          watch('urgency') === 'express' ? 'border-primary bg-primary/5' : 'border-border'
                        }`}
                      >
                        Express
                      </button>
                    </div>

                    {deliveryType === 'delivery' && (
                      <>
                        <div className="grid gap-2">
                          <Label htmlFor="zone">Zone / Quartier</Label>
                          <Input
                            id="zone"
                            placeholder="Ex. Badalabougou, ACI 2000"
                            {...form.register('zone')}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="address">Adresse de livraison</Label>
                          <Input
                            id="address"
                            placeholder="Adresse détaillée"
                            {...form.register('address')}
                          />
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Récapitulatif</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <p><strong>Type :</strong> {type === 'prescription' ? "Photo d'ordonnance" : 'Liste de médicaments'}</p>
                    <p><strong>Livraison :</strong> {deliveryType === 'pickup' ? 'Retrait' : 'Livraison'}</p>
                    <p><strong>Urgence :</strong> {watch('urgency') === 'express' ? 'Express' : 'Normal'}</p>
                    <p><strong>Génériques :</strong> {watch('accepts_generics') ? 'Oui' : 'Non'}</p>
                    {deliveryType === 'delivery' && (
                      <>
                        <p><strong>Zone :</strong> {watch('zone') || '—'}</p>
                        <p><strong>Adresse :</strong> {watch('address') || '—'}</p>
                      </>
                    )}
                    {type === 'list' && watch('items')?.length && (
                      <div>
                        <strong>Médicaments :</strong>
                        <ul className="mt-1 list-inside list-disc">
                          {watch('items').map((item, i) => (
                            <li key={i}>{item.medicine_name} × {item.quantity}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between gap-4">
            <Button type="button" variant="outline" onClick={onBack} disabled={step === 1}>
              <ChevronLeft className="size-4" />
              Retour
            </Button>
            {step < 3 ? (
              <Button type="button" onClick={onNext}>
                Suivant
                <ChevronRight className="size-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Envoi…' : 'Envoyer ma demande aux pharmacies'}
                <Send className="size-4" />
              </Button>
            )}
          </div>
        </form>
        </FormProvider>
      </div>
    </ClientLayout>
  );
}
