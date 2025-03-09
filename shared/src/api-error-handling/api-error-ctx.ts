import {HttpContext, HttpContextToken, HttpErrorResponse, HttpStatusCode} from "@angular/common/http";

export interface ApiErrorHandlerResult {
  message: string | null;
  translate?: boolean;
  excludedStatuses?: HttpStatusCode[]
}

export type ApiErrorHandler = (err: HttpErrorResponse) => ApiErrorHandlerResult;

const defaultApiErrorHandler: ApiErrorHandler = (err: HttpErrorResponse): ApiErrorHandlerResult => {
  const message = (err.error?.error?.message as string) || null;
  return {
    message: message || 'shared.errorOccurred',
    translate: !message,
    excludedStatuses: [HttpStatusCode.Forbidden, HttpStatusCode.Unauthorized]
  };
}

const apiErrorCtxToken = new HttpContextToken<ApiErrorHandler>(() => defaultApiErrorHandler);

export function reportApiError(handler: ApiErrorHandler) {
  return [apiErrorCtxToken, handler];
}

export function getApiErrorHandler(ctx?: HttpContext) {
  return ctx?.get(apiErrorCtxToken);
}
