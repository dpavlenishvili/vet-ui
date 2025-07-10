import {HttpContext, HttpContextToken, HttpErrorResponse, HttpStatusCode} from "@angular/common/http";
import { inject } from '@angular/core';
import { NotificationService } from '@progress/kendo-angular-notification';
import { AlertDialogService } from '../services/alert-dialog.service';

export interface ApiErrorHandlerResult {
  code: number | null;
  message: string | null;
  translate?: boolean;
  excludedStatuses?: HttpStatusCode[]
}


export interface ResolvedApiError {
  code: number;
  message: string;
}

export interface ApiErrorConditionalParams {
  when: (error: ResolvedApiError) => boolean;
  then: ApiErrorUiHandler;
  else: ApiErrorUiHandler;
}

export type ApiErrorHandler = (err: HttpErrorResponse) => ApiErrorHandlerResult;
export type ApiErrorUiHandler = (error: ResolvedApiError) => void;

const defaultApiErrorHandler: ApiErrorHandler = (err: HttpErrorResponse): ApiErrorHandlerResult => {
  const code = (err.error?.error?.code as number) || null;
  const message = (err.error?.error?.message as string) || null;
  return {
    code: code ?? 0,
    message: message || 'errors.server_error_0',
    translate: !message,
    excludedStatuses: [HttpStatusCode.Forbidden],
  };
}

const apiErrorCtxToken = new HttpContextToken<ApiErrorHandler>(() => defaultApiErrorHandler);
export const API_ERROR_UI_HANDLER = new HttpContextToken<ApiErrorUiHandler | null>(() => null);

export function useApiErrorUiHandlerContextFactory(apiErrorUiHandler: ApiErrorUiHandler) {
  return (baseContext?: HttpContext) => {
    baseContext = baseContext ?? new HttpContext();
    baseContext.set(API_ERROR_UI_HANDLER, apiErrorUiHandler);

    return baseContext;
  };
}

export function useApiErrorToastContextFactory() {
  return useApiErrorUiHandlerContextFactory(useToastApiErrorHandler());
}

export function useApiErrorAlertContextFactory() {
  return useApiErrorUiHandlerContextFactory(useAlertApiErrorHandler());
}

export function useApiErrorConditionalContextFactory(condition: ApiErrorConditionalParams) {
  return useApiErrorUiHandlerContextFactory(useConditionalApiErrorUiHandler(condition));
}

export function useToastApiErrorHandler(): ApiErrorUiHandler {
  const notificationService = inject(NotificationService);

  return ({ message }: ResolvedApiError) => {
    notificationService.show({
      content: message,
      animation: { type: 'slide', duration: 400 },
      position: { horizontal: 'center', vertical: 'top' },
      type: { style: 'error', icon: true },
      hideAfter: 3000,
    });
  };
}

export function useAlertApiErrorHandler(): ApiErrorUiHandler {
  const alertDialogService = inject(AlertDialogService);

  return ({ message }: ResolvedApiError) => {
    alertDialogService.show({
      variant: 'error',
      text: message,
    });
  };
}

export function useConditionalApiErrorUiHandler(params: ApiErrorConditionalParams): ApiErrorUiHandler {
  return (error: ResolvedApiError) => {
    if (params.when(error)) {
      params.then(error);
    } else {
      params.else(error);
    }
  };
}

export function getApiErrorHandler(ctx?: HttpContext) {
  return ctx?.get(apiErrorCtxToken);
}

export function getApiErrorUiHandler(ctx?: HttpContext) {
  return ctx?.get(API_ERROR_UI_HANDLER);
}
