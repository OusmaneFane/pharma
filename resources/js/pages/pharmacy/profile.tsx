import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PharmacyLayout from '@/layouts/pharmacy-layout';

export default function PharmacyProfile() {
  return (
    <PharmacyLayout title="Profil">
      <Head title="Profil pharmacie - PharmaConnect" />

      <Card className="mt-6 max-w-2xl overflow-hidden border-0 bg-white shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/60">
        <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-emerald-50/80 to-white px-6 py-4">
          <CardTitle className="text-base font-semibold text-slate-800">Profil pharmacie</CardTitle>
          <CardDescription>
            Informations de votre compte et de votre pharmacie
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-sm text-slate-500">
            Page profil — à personnaliser (nom pharmacie, adresse, horaires, etc.).
          </p>
        </CardContent>
      </Card>
    </PharmacyLayout>
  );
}
