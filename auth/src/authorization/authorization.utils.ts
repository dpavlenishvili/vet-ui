import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { getDifferenceInSeconds } from '@vet/shared';
import { AuthorizationError, AuthorizationResult } from '../auth.types';
import { UserLogin2FaResponseBody } from '@vet/backend';

export function is2faRequiredError(error: unknown): error is HttpErrorResponse {
  return error instanceof HttpErrorResponse && error.status === HttpStatusCode.Forbidden && error.error.token;
}

export function handleAuthorizationResponse(
  response: AuthorizationResult,
  params: {
    twoFaTimestamp?: number;
    onSuccess?: () => void;
    on2faRequired?: (response: UserLogin2FaResponseBody) => void;
    onError?: (error: AuthorizationError) => void;
  },
) {
  const { twoFaTimestamp, onSuccess, on2faRequired, onError } = params;

  if ('access_token' in response) {
    onSuccess?.();
    return;
  }

  if (response instanceof HttpErrorResponse) {
    switch (response?.error?.error?.code) {
      case 1001:
        onError?.({ code: 'INVALID_CREDENTIALS', error: response });
        return;

      case 1002: {
        const diff = getDifferenceInSeconds(Date.now(), twoFaTimestamp ?? null);
        onError?.({
          code: 'TEMPORARILY_LOCKED',
          error: response,
          attributes: {
            lockedForSeconds: diff ? 60 - diff : null,
          },
        });
        return;
      }

      default:
        onError?.({ code: 'UNKNOWN', error: response });
        return;
    }
  }

  if (response instanceof Error) {
    onError?.({ code: 'UNKNOWN', error: response });
    return;
  }

  on2faRequired?.(response as UserLogin2FaResponseBody);
}
