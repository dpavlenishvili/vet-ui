import { useSessionValue } from '@vet/shared';
import { AuthorizationError, Credentials, Pending2FaState } from '../../auth.types';
import { computed, inject, signal } from '@angular/core';
import { AuthenticationService, useAuthEnvironment } from '@vet/auth';
import { firstValueFrom } from 'rxjs';
import { handleAuthorizationResponse } from '../authorization.utils';
import { use2FaSession } from './use2FaSession';

export function useAuthorizationSession(params: {
  onLogin?: () => void;
  onError?: (error: AuthorizationError) => void;
  onReset?: () => void;
}) {
  const { onLogin, onError, onReset } = params;
  const authEnvironment = useAuthEnvironment();
  const authService = inject(AuthenticationService);

  const timeoutSeconds = authEnvironment.login2faTimeoutSeconds;
  const pending2Fa = useSessionValue<Pending2FaState | null>('AUTH_2FA_PENDING', null, timeoutSeconds * 1000);

  const isLoginLoading = signal(false);

  const {
    is2FaSessionActive,
    twoFaLoading,
    twoFaValid,
    twoFaTimestamp,
    twoFaMaskedPhoneNumber,
    send2FaCode,
    validate2FaCode,
    initialize2FaSession,
    reset2FaSession,
    invalidate2faSession,
  } = use2FaSession({ onLogin, onError, onReset });

  const submitCredentials = async ({ pid, password, remember }: Credentials) => {
    if (remember) {
      authService.setRemember(remember);
    }

    const existingPending = pending2Fa();

    if (!existingPending?.isUsed && existingPending?.pid === pid) {
      return;
    }

    isLoginLoading.set(true);

    const response = await firstValueFrom(authService.login({ pid, password })).catch((error) => error);

    handleAuthorizationResponse(response, {
      twoFaTimestamp: twoFaTimestamp(),
      onSuccess: () => {
        invalidate2faSession();
        onLogin?.();
      },
      on2faRequired: (response) => {
        initialize2FaSession(response, pid);
      },
      onError,
    });

    isLoginLoading.set(false);
  };

  return {
    is2FaSessionActive: is2FaSessionActive,
    isLoading: computed(() => isLoginLoading() || twoFaLoading()),
    twoFaValid,
    twoFaTimestamp,
    twoFaMaskedPhoneNumber,
    send2FaCode,
    submitCredentials,
    validate2FaCode,
    resetAuthorizationSession: reset2FaSession,
    invalidateAuthorizationSession: invalidate2faSession,
  };
}
