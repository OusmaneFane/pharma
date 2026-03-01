import { Form, Head } from '@inertiajs/react';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

export default function VerifyEmail({ status }: { status?: string }) {
  return (
    <AuthLayout
      title="Vérification de l'email 📧"
      description="Cliquez sur le lien envoyé à votre adresse email pour vérifier votre compte."
    >
      <Head title="Vérification email - PharmaConnect" />

      {status === 'verification-link-sent' && (
        <div className="mb-4 flex items-center justify-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-800">
          <span aria-hidden>✅</span> Un nouveau lien de vérification a été envoyé à votre adresse email.
        </div>
      )}

      <Form {...send.form()} className="space-y-5 text-center">
        {({ processing }) => (
          <>
            <Button
              disabled={processing}
              variant="secondary"
              className="h-11 w-full font-semibold"
            >
              {processing && <Spinner />}
              Renvoyer l&apos;email de vérification
            </Button>

            <TextLink href={logout()} className="block text-sm font-medium text-primary">
              Se déconnecter
            </TextLink>
          </>
        )}
      </Form>
    </AuthLayout>
  );
}
