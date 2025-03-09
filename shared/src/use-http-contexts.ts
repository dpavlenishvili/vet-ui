import { HttpContext, HttpContextToken } from '@angular/common/http';

/**
 * Creates a new HttpContext with the given tokens.
 * @param tokens
 */
export function useHttpContexts(...tokens: Array<[HttpContextToken<unknown>, unknown]>): HttpContext {
  const ctx = new HttpContext();
  for (const [token, value] of tokens) {
    ctx.set(token, value);
  }
  return ctx;
}
