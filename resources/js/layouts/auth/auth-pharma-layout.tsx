import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

const APP_FEATURES = [
  { emoji: '📋', label: 'Demandes', color: 'bg-primary/20' },
  { emoji: '⚖️', label: 'Offres', color: 'bg-amber-500/20' },
  { emoji: '🚚', label: 'Livraison', color: 'bg-emerald-500/20' },
];

export default function AuthPharmaLayout({
  children,
  title,
  description,
}: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-svh w-full items-center justify-center overflow-hidden px-4 py-6 sm:px-6">
      {/* Fond teal + cercles flous type bokeh */}
      <div className="absolute inset-0 -z-10 bg-primary/20" aria-hidden />
      <div
        className="absolute -z-10 size-[320px] rounded-full bg-primary/30 blur-[100px]"
        style={{ top: '10%', left: '5%' }}
        aria-hidden
      />
      <div
        className="absolute -z-10 size-[280px] rounded-full bg-primary/25 blur-[90px]"
        style={{ top: '50%', right: '10%' }}
        aria-hidden
      />
      <div
        className="absolute -z-10 size-[200px] rounded-full bg-primary/20 blur-[80px]"
        style={{ bottom: '15%', left: '30%' }}
        aria-hidden
      />

      {/* Carte unique : gauche = formulaire, droite = branding + infos */}
      <div className="w-full max-w-4xl">
        <div className="rounded-3xl border border-white/80 bg-white/90 shadow-2xl shadow-slate-300/30 backdrop-blur-xl overflow-hidden">
          <div className="grid lg:grid-cols-2">
            {/* Partie gauche — formulaire */}
            <div className="flex flex-col justify-center p-5 sm:p-6 lg:p-8">
              <div className="mb-4">
                <h1 className="font-display text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                  {title}
                </h1>
                {description && (
                  <p className="mt-1 text-sm text-slate-600">
                    {description}
                  </p>
                )}
              </div>
              {children}
            </div>

            {/* Partie droite — branding + présentation de l'app */}
            <div className="flex flex-col justify-center border-t border-slate-200/60 bg-primary/10 p-5 sm:p-6 lg:border-l lg:border-t-0 lg:p-8">
              <Link
                href={home()}
                className="inline-flex items-center gap-3 transition-opacity hover:opacity-90"
              >
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25">
                  <span className="text-2xl" aria-hidden>💊</span>
                </div>
                <div>
                  <span className="font-display text-xl font-bold tracking-tight text-slate-900">
                    PharmaConnect
                  </span>
                  <span className="mt-0.5 block text-[11px] font-medium uppercase tracking-widest text-slate-500">
                    Marketplace santé · Mali 🇲🇱
                  </span>
                </div>
              </Link>

              <p className="mt-6 flex gap-2 text-sm leading-relaxed text-slate-600">
                <span className="shrink-0 text-lg" aria-hidden>✨</span>
                <span>Votre plateforme de commande de médicaments moderne et intuitive : envoyez votre ordonnance ou votre liste aux pharmacies partenaires, comparez les offres et recevez en retrait ou en livraison.</span>
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {APP_FEATURES.map(({ emoji, label, color }) => (
                  <div
                    key={label}
                    className={`flex size-14 shrink-0 items-center justify-center rounded-full text-2xl ${color}`}
                    title={label}
                  >
                    {emoji}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] font-medium uppercase tracking-wider text-slate-500">
          © PharmaConnect 🇲🇱 · Tous droits réservés
        </p>
      </div>
    </div>
  );
}
