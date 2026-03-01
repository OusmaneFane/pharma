import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { update } from '@/routes/password';

type Props = {
  token: string;
  email: string;
};

export default function ResetPassword({ token, email }: Props) {
  return (
    <AuthLayout
      title="Nouveau mot de passe 🔐"
      description="Choisissez un nouveau mot de passe pour votre compte"
    >
      <Head title="Réinitialisation - PharmaConnect" />

      <Form
        {...update.form()}
        transform={(data) => ({ ...data, token, email })}
        resetOnSuccess={['password', 'password_confirmation']}
        className="space-y-5"
      >
        {({ processing, errors }) => (
          <>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-slate-700">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                readOnly
                className="h-11 border-slate-200 bg-slate-50"
              />
              <InputError message={errors.email} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password" className="text-slate-700">Nouveau mot de passe</Label>
              <Input
                id="password"
                type="password"
                name="password"
                autoComplete="new-password"
                autoFocus
                placeholder="••••••••"
                className="h-11 border-slate-200"
              />
              <InputError message={errors.password} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password_confirmation" className="text-slate-700">Confirmer le mot de passe</Label>
              <Input
                id="password_confirmation"
                type="password"
                name="password_confirmation"
                autoComplete="new-password"
                placeholder="••••••••"
                className="h-11 border-slate-200"
              />
              <InputError message={errors.password_confirmation} />
            </div>

            <Button
              type="submit"
              className="h-11 w-full font-semibold"
              disabled={processing}
              data-test="reset-password-button"
            >
              {processing && <Spinner />}
              Réinitialiser le mot de passe
            </Button>
          </>
        )}
      </Form>
    </AuthLayout>
  );
}
