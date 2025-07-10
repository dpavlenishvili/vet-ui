import { computed, effect, inject, signal } from '@angular/core';
import { SmsService, UserLogin2FaResponseBody } from '@vet/backend';
import { AuthenticationService, useAuthEnvironment } from '@vet/auth';
import { useSessionValue } from '@vet/shared';
import { Pending2FaState, TwoFaError } from '../../auth.types';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export function use2FaSession(params: {
  onLogin?: () => void;
  onError?: (error: TwoFaError) => void;
  onReset?: () => void;
}) {
  const { onLogin, onError, onReset } = params;
  const smsService = inject(SmsService);
  const authService = inject(AuthenticationService);
  const authEnvironment = useAuthEnvironment();
  const twoFaCode = signal('');
  const twoFaValid = signal<boolean | null>(null);
  const twoFaTimestamp = computed(() => pending2Fa()?.timestamp ?? Date.now());
  const twoFaMaskedPhoneNumber = computed(() => pending2Fa()?.maskedPhoneNumber ?? '');
  const timeoutSeconds = authEnvironment.login2faTimeoutSeconds;
  const pending2Fa = useSessionValue<Pending2FaState | null>('AUTH_2FA_PENDING', null, timeoutSeconds * 1000);
  const twoFaLoading = signal(false);
  const is2FaSessionActive = computed(() => {
    const pending = pending2Fa();

    return pending && !pending.isUsed;
  });

  /**
   * Starts 2FA authorization session
   *
   * @param response
   * @param pid
   */
  const initialize2FaSession = (response: UserLogin2FaResponseBody, pid: string) => {
    pending2Fa.set({
      pid,
      token: response.token,
      maskedPhoneNumber: response.phone_mask,
      timestamp: Date.now(),
      isUsed: false,
    });
    twoFaCode.set('');
    twoFaValid.set(null);
    onReset?.();
  };

  /**
   * Validates 2FA code against server
   *
   * @param code
   */
  const validate2FaCode = async (code: string) => {
    if (!code) {
      return;
    }

    const pending = pending2Fa();

    if (!pending) {
      onError?.({ code: '2FA_SESSION_EXPIRED', error: new Error('Session expired') });
      return;
    }

    if (pending.isUsed) {
      onError?.({ code: 'INVALID_2FA_SESSION', error: new Error('Session is invalid') });
      return;
    }

    twoFaLoading.set(true);

    try {
      await firstValueFrom(
        authService.validate2FaCode({
          token: pending.token,
          code,
        }),
      );

      twoFaLoading.set(false);
      twoFaValid.set(true);
      invalidate2faSession();
      onLogin?.();
    } catch (error) {
      twoFaLoading.set(false);
      twoFaValid.set(false);

      if (error instanceof HttpErrorResponse && error?.error?.error) {
        if (error.error.error.code === 1004) {
          onError?.({ code: 'INVALID_2FA_CODE', error });
        } else if (error.error.error.code === 1005) {
          onError?.({ code: '2FA_CODE_EXPIRED', error });
          send2FaCode();
        }else {
          onError?.({ code: '2FA_VALIDATION_FAILED', error });
        }
      } else {
        onError?.({ code: '2FA_VALIDATION_FAILED', error });
      }
    }
  };

  /**
   * Resends 2fa code to the user
   */
  const send2FaCode = () => {
    const pending = pending2Fa();

    if (!pending) return;

    twoFaLoading.set(true);
    twoFaValid.set(null);
    onReset?.();
    smsService.sendSmsCode({ token: pending.token }).subscribe({
      next: (response) => {
        twoFaLoading.set(false);

        if (!('access_token' in response)) {
          initialize2FaSession(response as UserLogin2FaResponseBody, pending.pid);
        }
      },
      error: (error) => {
        twoFaLoading.set(false);
        onError?.({ code: '2FA_RESEND_FAILED', error });
      },
    });
  };

  /**
   * Invalidates 2fa session and clears in-memory 2fa-related state
   */
  const reset2FaSession = () => {
    invalidate2faSession();
    twoFaCode.set('');
    twoFaValid.set(null);
    onReset?.();
  };

  /**
   * Marks 2fa session as invalid, while keeping state in the session storage for proper user errors
   */
  const invalidate2faSession = () => {
    pending2Fa.update((state) =>
      !state
        ? null
        : {
            ...state,
            isUsed: true,
          },
    );
  };

  effect(() => {
    if (is2FaSessionActive()) {
      twoFaValid.set(null);
      twoFaCode.set('');
      onReset?.();
    }
  });

  return {
    is2FaSessionActive: is2FaSessionActive,
    twoFaLoading: twoFaLoading.asReadonly(),
    twoFaValid: twoFaValid.asReadonly(),
    twoFaTimestamp,
    twoFaMaskedPhoneNumber,
    initialize2FaSession,
    validate2FaCode,
    send2FaCode,
    reset2FaSession,
    invalidate2faSession,
  };
}
