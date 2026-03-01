import { Form, Head } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { PhoneInput } from '@/components/ui/phone-input';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { store } from '@/routes/register';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/types';

const PHARMACONNECT_ROLES = [
  { value: 'client' as const, label: 'Client', description: 'Je cherche des médicaments', icon: '🛒' },
  { value: 'pharmacy' as const, label: 'Pharmacie', description: 'Je propose des offres aux clients', icon: '💊' },
];

type RegisterProps = {
  roles?: { value: string; label: string; description: string }[];
};

export default function Register({ roles = PHARMACONNECT_ROLES }: RegisterProps) {
  const [role, setRole] = useState<UserRole>('client');
  const [phoneValue, setPhoneValue] = useState('');

  return (
    <AuthLayout
      title="Créer un compte ✨"
      description="Rejoignez la marketplace santé au Mali 🇲🇱"
    >
      <Head title="Inscription - PharmaConnect" />
      <Form
        {...store.form()}
        resetOnSuccess={['password', 'password_confirmation']}
        disableWhileProcessing
        className="flex flex-col gap-3"
      >
        {({ processing, errors }) => (
          <>
            <input type="hidden" name="role" value={role} />
            <div className="grid gap-3">
              <div className="grid gap-1.5">
                <Label className="text-slate-700">Vous êtes 👤</Label>
                <div className="grid grid-cols-2 gap-2">
                  {roles.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setRole(r.value as UserRole)}
                      className={cn(
                        'rounded-lg border-2 p-3 text-left transition-all',
                        role === r.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-slate-200 hover:border-primary/50 hover:bg-slate-50'
                      )}
                    >
                      <span className="text-xl" aria-hidden>{r.value === 'pharmacy' ? '💊' : '🛒'}</span>
                      <span className="mt-0.5 block text-sm font-display font-semibold">{r.label}</span>
                      <span className="text-[11px] text-slate-500">{r.description}</span>
                    </button>
                  ))}
                </div>
                <InputError message={errors.role} />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="name" className="text-slate-700">Nom complet</Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    autoFocus
                    tabIndex={1}
                    autoComplete="name"
                    name="name"
                    placeholder="Votre nom"
                    className="h-10 border-slate-200 text-sm"
                  />
                  <InputError message={errors.name} />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="email" className="text-slate-700">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    tabIndex={2}
                    autoComplete="email"
                    name="email"
                    placeholder="vous@exemple.com"
                    className="h-10 border-slate-200 text-sm"
                  />
                  <InputError message={errors.email} />
                </div>
              </div>

              {role === 'pharmacy' && (
                <div className="grid gap-1.5">
                  <Label htmlFor="pharmacy_name" className="text-slate-700">Nom de la pharmacie</Label>
                  <Input
                    id="pharmacy_name"
                    type="text"
                    required
                    name="pharmacy_name"
                    placeholder="Ex. Pharmacie du Marché"
                    className="h-10 border-slate-200 text-sm"
                  />
                  <InputError message={errors.pharmacy_name} />
                </div>
              )}

              <div className="grid gap-1.5">
                <Label className="text-slate-700">Téléphone (Mali +223)</Label>
                <PhoneInput
                  value={phoneValue}
                  onChange={(_, full) => setPhoneValue(full)}
                />
                <input type="hidden" name="phone" value={phoneValue} />
                <InputError message={errors.phone} />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="password" className="text-slate-700">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    tabIndex={3}
                    autoComplete="new-password"
                    name="password"
                    placeholder="••••••••"
                    className="h-10 border-slate-200 text-sm"
                  />
                  <InputError message={errors.password} />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="password_confirmation" className="text-slate-700">Confirmer</Label>
                  <Input
                    id="password_confirmation"
                    type="password"
                    required
                    tabIndex={4}
                    autoComplete="new-password"
                    name="password_confirmation"
                    placeholder="••••••••"
                    className="h-10 border-slate-200 text-sm"
                  />
                  <InputError message={errors.password_confirmation} />
                </div>
              </div>

              <Button
                type="submit"
                className="h-10 w-full font-semibold text-sm"
                tabIndex={5}
                disabled={processing}
                data-test="register-user-button"
              >
                {processing && <Spinner />}
                Créer mon compte
              </Button>
            </div>

            <p className="text-center text-sm text-slate-600">
              Déjà un compte ?{' '}
              <TextLink href={login()} tabIndex={6} className="font-medium text-primary">
                Se connecter 🔐
              </TextLink>
            </p>
          </>
        )}
      </Form>
    </AuthLayout>
  );
}
