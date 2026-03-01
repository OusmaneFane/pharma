import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/password/confirm';

export default function ConfirmPassword() {
  return (
    <AuthLayout
      title="Confirmer votre mot de passe 🔒"
      description="Cette zone est sécurisée. Confirmez votre mot de passe pour continuer."
    >
      <Head title="Confirmer le mot de passe - PharmaConnect" />

      <Form {...store.form()} resetOnSuccess={['password']} className="space-y-5">
        {({ processing, errors }) => (
          <>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-slate-700">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                autoComplete="current-password"
                autoFocus
                className="h-11 border-slate-200"
              />
              <InputError message={errors.password} />
            </div>

            <Button
              className="h-11 w-full font-semibold"
              disabled={processing}
              data-test="confirm-password-button"
            >
              {processing && <Spinner />}
              Confirmer
            </Button>
          </>
        )}
      </Form>
    </AuthLayout>
  );
}
