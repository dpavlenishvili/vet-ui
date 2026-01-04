import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';
import { AuthenticationService } from './authentication.service';

export const authenticatedGuard: CanActivateFn = () => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);

  return toObservable(authenticationService.isReady).pipe(
    filter((isReady) => isReady),
    take(1),
    map(() => {
      try {
        if (authenticationService.hasTokens()) {
          return true;
        }
        return new RedirectCommand(router.parseUrl('/'));
      } catch {
        return new RedirectCommand(router.parseUrl('/'));
      }
    }),
  );
};

export const unAuthenticatedGuard: CanActivateFn = () => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);

  return toObservable(authenticationService.isReady).pipe(
    filter((isReady) => isReady),
    take(1),
    map(() => {
      try {
        if (!authenticationService.hasTokens()) {
          return true;
        }
        return new RedirectCommand(router.parseUrl('/'));
      } catch {
        return new RedirectCommand(router.parseUrl('/'));
      }
    }),
  );
};
