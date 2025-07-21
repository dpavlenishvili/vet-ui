import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs/operators';

export const authenticatedGuard: CanActivateFn = () => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);

  return toObservable(authenticationService.areCookiesLoaded).pipe(
    filter(loaded => loaded),
    take(1),
    map(() => {
      if (authenticationService.hasTokens()) {
        return true;
      }
      return new RedirectCommand(router.parseUrl('/'));
    })
  );
};

export const unAuthenticatedGuard: CanActivateFn = () => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);

  return toObservable(authenticationService.areCookiesLoaded).pipe(
    filter(loaded => loaded),
    take(1),
    map(() => {
      if (!authenticationService.hasTokens()) {
        return true;
      }
      return new RedirectCommand(router.parseUrl('/'));
    })
  );
};
