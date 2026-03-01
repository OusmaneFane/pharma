import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
  status?: string;
  canResetPassword: boolean;
  canRegister: boolean;
};

export default function Login({
  status,
  canResetPassword,
  canRegister,
}: Props) {
  return (
    <AuthLayout
      title="Connexion 🔐"
      description="Entrez votre email et mot de passe pour accéder à votre compte"
    >
      <Head title="Connexion - PharmaConnect" />

      {status && (
        <div className="mb-4 flex items-center justify-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-800">
          <span aria-hidden>✅</span> {status}
        </div>
      )}

      <Form
        {...store.form()}
        resetOnSuccess={['password']}
        className="flex flex-col gap-5"
      >
        {({ processing, errors }) => (
          <>
            <div className="grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-slate-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  required
                  autoFocus
                  tabIndex={1}
                  autoComplete="email"
                  placeholder="vous@exemple.com"
                  className="h-11 border-slate-200"
                />
                <InputError message={errors.email} />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-700">Mot de passe</Label>
                  {canResetPassword && (
                    <TextLink
                      href={request()}
                      className="text-sm text-primary hover:underline"
                      tabIndex={5}
                    >
                      Mot de passe oublié ?
                    </TextLink>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  required
                  tabIndex={2}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="h-11 border-slate-200"
                />
                <InputError message={errors.password} />
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  name="remember"
                  tabIndex={3}
                />
                <Label htmlFor="remember" className="text-sm font-normal text-slate-600 cursor-pointer">
                  Se souvenir de moi 📌
                </Label>
              </div>

              <Button
                type="submit"
                className="h-11 w-full font-semibold"
                tabIndex={4}
                disabled={processing}
                data-test="login-button"
              >
                {processing && <Spinner />}
                Se connecter
              </Button>
            </div>

            {canRegister && (
              <p className="text-center text-sm text-slate-600">
                Pas encore de compte ?{' '}
                <TextLink href={register()} tabIndex={5} className="font-medium text-primary">
                  S&apos;inscrire ✨
                </TextLink>
              </p>
            )}
          </>
        )}
      </Form>
    </AuthLayout>
  );
}
