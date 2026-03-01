import { Head, Link } from '@inertiajs/react';
import { PlusCircle, FileText, ArrowRight, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ClientLayout from '@/layouts/client-layout';

export default function ClientDashboard() {
  return (
    <ClientLayout title="Tableau de bord">
      <Head title="Tableau de bord - PharmaConnect" />

      <div className="mt-6 rounded-2xl border-0 bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 p-6 shadow-lg shadow-primary/10 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-slate-900 md:text-2xl">
              Bienvenue sur PharmaConnect
            </h2>
            <p className="mt-2 text-slate-600 max-w-xl">
              Envoyez votre ordonnance ou votre liste de médicaments. Les pharmacies partenaires vous envoient des offres. Comparez, choisissez et recevez en retrait ou en livraison.
            </p>
          </div>
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/20">
            <Sparkles className="size-7 text-primary" />
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Link href="/client/orders/new">
          <Card className="h-full overflow-hidden border-0 bg-white shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/60 transition-all hover:shadow-xl hover:ring-primary/20">
            <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-primary/5 to-white px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                  <PlusCircle className="size-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg text-slate-900">Nouvelle demande</CardTitle>
                  <CardDescription className="mt-0.5">
                    Ordonnance ou liste de médicaments
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-between p-6">
              <p className="text-sm text-slate-600">
                Envoyez une photo d&apos;ordonnance ou une liste aux pharmacies de votre zone.
              </p>
              <Button size="sm" className="shrink-0">
                Créer une demande
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/client/orders">
          <Card className="h-full overflow-hidden border-0 bg-white shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/60 transition-all hover:shadow-xl hover:ring-primary/20">
            <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-xl bg-slate-100">
                  <FileText className="size-6 text-slate-600" />
                </div>
                <div>
                  <CardTitle className="text-lg text-slate-900">Mes commandes</CardTitle>
                  <CardDescription className="mt-0.5">
                    Suivi et historique
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-between p-6">
              <p className="text-sm text-slate-600">
                Consultez vos demandes, comparez les offres et suivez vos commandes.
              </p>
              <Button variant="outline" size="sm" className="shrink-0">
                Voir mes commandes
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>
    </ClientLayout>
  );
}
