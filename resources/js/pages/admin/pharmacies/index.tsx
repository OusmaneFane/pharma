import { Head, Link, usePage, router } from '@inertiajs/react';
import { Building2, Mail, MapPin, ShieldCheck, ShieldOff, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/layouts/admin-layout';
import type { Pharmacy } from '@/types';

interface PaginatedPharmacies {
  data: Pharmacy[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  links?: { url: string | null; label: string; active: boolean }[];
}

export default function AdminPharmaciesIndex({
  pharmacies,
}: {
  pharmacies: PaginatedPharmacies;
}) {
  const { data: list, current_page, last_page, total, links } = pharmacies;
  const flash = (usePage().props as { flash?: { success?: string } }).flash;

  return (
    <AdminLayout title="Pharmacies">
      <Head title="Pharmacies - Admin PharmaConnect" />
      {flash?.success && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {flash.success}
        </div>
      )}
      <Card className="overflow-hidden border-0 bg-white shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/60">
        <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-800">
            <Building2 className="size-5 text-primary" />
            Liste et validation des pharmacies
          </CardTitle>
          <p className="mt-1 text-xs text-slate-500">
            {total} pharmacie{total !== 1 ? 's' : ''} au total
          </p>
        </CardHeader>
        <CardContent className="p-0">
          {list.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Building2 className="size-8" />
              </div>
              <p className="mt-4 text-sm text-slate-600">Aucune pharmacie enregistrée.</p>
              <Link href="/admin" className="mt-4 text-sm font-medium text-primary hover:underline">
                ← Tableau de bord
              </Link>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Pharmacie
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Zone / Adresse
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        N° licence
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Note · Commandes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {list.map((pharmacy) => (
                      <tr key={pharmacy.id} className="transition-colors hover:bg-slate-50/80">
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-900">{pharmacy.name}</div>
                          {pharmacy.user?.email && (
                            <a
                              href={`mailto:${pharmacy.user.email}`}
                              className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500 hover:text-primary"
                            >
                              <Mail className="size-3.5" />
                              {pharmacy.user.email}
                            </a>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-1.5 text-slate-700">
                            <MapPin className="mt-0.5 size-3.5 shrink-0 text-slate-400" />
                            <span>
                              {pharmacy.zone ?? '—'}
                              {pharmacy.address && (
                                <span className="block text-xs text-slate-500">
                                  {pharmacy.address}
                                </span>
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-slate-600">
                          {pharmacy.license_number ?? '—'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap items-center gap-2">
                            {pharmacy.is_verified ? (
                              <Badge className="inline-flex items-center gap-1 rounded-md bg-emerald-100 text-emerald-800 border-emerald-200">
                                <ShieldCheck className="size-3.5" />
                                Vérifiée
                              </Badge>
                            ) : (
                              <Badge variant="default" className="inline-flex items-center gap-1 rounded-md bg-slate-100 text-slate-700 border-slate-200">
                                <ShieldOff className="size-3.5" />
                                Non vérifiée
                              </Badge>
                            )}
                            {pharmacy.is_active ? (
                              <Badge className="inline-flex items-center gap-1 rounded-md bg-blue-100 text-blue-800 border-blue-200">
                                <ToggleRight className="size-3.5" />
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="default" className="inline-flex items-center gap-1 rounded-md bg-slate-100 text-slate-700 border-slate-200">
                                <ToggleLeft className="size-3.5" />
                                Inactive
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-medium text-slate-800">
                            {Number(pharmacy.rating ?? 0).toFixed(1)} ★
                          </span>
                          <span className="text-slate-500"> · </span>
                          <span className="text-slate-600">
                            {pharmacy.total_orders ?? 0} commande{(pharmacy.total_orders ?? 0) !== 1 ? 's' : ''}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={() => router.post(`/admin/pharmacies/${pharmacy.id}/toggle-verified`)}
                            >
                              {pharmacy.is_verified ? 'Retirer vérif.' : 'Vérifier'}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={() => router.post(`/admin/pharmacies/${pharmacy.id}/toggle-active`)}
                            >
                              {pharmacy.is_active ? 'Désactiver' : 'Activer'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {last_page > 1 && links && links.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-1 border-t border-slate-100 bg-slate-50/30 px-6 py-4">
                  {links.map((link, i) => (
                    <span key={i}>
                      {link.url ? (
                        <Link
                          href={link.url}
                          className={`inline-flex min-w-[2.25rem] justify-center rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors ${
                            link.active
                              ? 'bg-primary text-white'
                              : 'text-slate-600 hover:bg-slate-200/80'
                          }`}
                        >
                          {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                        </Link>
                      ) : (
                        <span className="inline-flex min-w-[2.25rem] justify-center rounded-lg px-2.5 py-1.5 text-sm text-slate-400">
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
