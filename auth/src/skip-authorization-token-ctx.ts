import { HttpContext, HttpContextToken } from '@angular/common/http';

const authToken = new HttpContextToken<boolean>(() => false);

export function skipAuthorizationCtx(): [HttpContextToken<boolean>, boolean] {
  return [authToken, true];
}

export function authorizationSkipped(ctx?: HttpContext): boolean {
  return !!ctx?.get(authToken);
}
