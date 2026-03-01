import { Form, Head } from '@inertiajs/react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useMemo, useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { OTP_MAX_LENGTH } from '@/hooks/use-two-factor-auth';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/two-factor/login';

export default function TwoFactorChallenge() {
  const [showRecoveryInput, setShowRecoveryInput] = useState<boolean>(false);
  const [code, setCode] = useState<string>('');

  const authConfigContent = useMemo<{
    title: string;
    description: string;
    toggleText: string;
  }>(() => {
    if (showRecoveryInput) {
      return {
        title: 'Code de récupération 🆘',
        description: 'Entrez un de vos codes de récupération d\'urgence pour confirmer l\'accès à votre compte.',
        toggleText: 'utiliser un code d\'authentification',
      };
    }
    return {
      title: 'Authentification à deux facteurs 🔐',
      description: 'Entrez le code fourni par votre application d\'authentification.',
      toggleText: 'utiliser un code de récupération',
    };
  }, [showRecoveryInput]);

  const toggleRecoveryMode = (clearErrors: () => void): void => {
    setShowRecoveryInput(!showRecoveryInput);
    clearErrors();
    setCode('');
  };

  return (
    <AuthLayout
      title={authConfigContent.title}
      description={authConfigContent.description}
    >
      <Head title="Authentification à deux facteurs - PharmaConnect" />

      <div className="space-y-5">
        <Form
          {...store.form()}
          className="space-y-5"
          resetOnError
          resetOnSuccess={!showRecoveryInput}
        >
          {({ errors, processing, clearErrors }) => (
            <>
              {showRecoveryInput ? (
                <>
                  <div className="grid gap-2">
                    <Input
                      name="recovery_code"
                      type="text"
                      placeholder="Code de récupération"
                      autoFocus={showRecoveryInput}
                      required
                      className="h-11 border-slate-200"
                    />
                    <InputError message={errors.recovery_code} />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-3 text-center">
                  <div className="flex w-full items-center justify-center">
                    <InputOTP
                      name="code"
                      maxLength={OTP_MAX_LENGTH}
                      value={code}
                      onChange={(value) => setCode(value)}
                      disabled={processing}
                      pattern={REGEXP_ONLY_DIGITS}
                    >
                      <InputOTPGroup>
                        {Array.from(
                          { length: OTP_MAX_LENGTH },
                          (_, index) => (
                            <InputOTPSlot key={index} index={index} />
                          )
                        )}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <InputError message={errors.code} />
                </div>
              )}

              <Button
                type="submit"
                className="h-11 w-full font-semibold"
                disabled={processing}
              >
                Continuer
              </Button>

              <p className="text-center text-sm text-slate-600">
                Ou{' '}
                <button
                  type="button"
                  className="font-medium text-primary underline hover:no-underline"
                  onClick={() => toggleRecoveryMode(clearErrors)}
                >
                  {authConfigContent.toggleText}
                </button>
              </p>
            </>
          )}
        </Form>
      </div>
    </AuthLayout>
  );
}
