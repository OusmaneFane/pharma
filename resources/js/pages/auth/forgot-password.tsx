import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
  return (
    <AuthLayout
      title="Mot de passe oublié 🔑"
      description="Entrez votre email pour recevoir un lien de réinitialisation"
    >
      <Head title="Mot de passe oublié - PharmaConnect" />

      {status && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-800">
          {status}
        </div>
      )}

      <div className="space-y-5">
        <Form {...email.form()}>
          {({ processing, errors }) => (
            <>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-slate-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  placeholder="vous@exemple.com"
                  className="h-11 border-slate-200"
                />
                <InputError message={errors.email} />
              </div>

              <Button
                className="h-11 w-full font-semibold"
                disabled={processing}
                data-test="email-password-reset-link-button"
              >
                {processing && <LoaderCircle className="size-4 animate-spin" />}
                Envoyer le lien de réinitialisation
              </Button>
            </>
          )}
        </Form>

        <p className="text-center text-sm text-slate-600">
          <TextLink href={login()} className="font-medium text-primary">
            ← Retour à la connexion
          </TextLink>
        </p>
      </div>
    </AuthLayout>
  );
}
