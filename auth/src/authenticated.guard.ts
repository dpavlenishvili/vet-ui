import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs/operators';

export const authenticatedGuard: CanActivateFn = () => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);


  return toObservable(authenticationService.isReady).pipe(
    filter(ready => ready),
    take(1),
    map(() => {
      if (authenticationService.isAuthenticated()) {
        return true;
      }
      return new RedirectCommand(router.parseUrl('/'));
    })
  );
};

export const unAuthenticatedGuard: CanActivateFn = () => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);


  return toObservable(authenticationService.isReady).pipe(
    filter(ready => ready),
    take(1),
    map(() => {
      if (!authenticationService.isAuthenticated()) {
        return true;
      }
      return new RedirectCommand(router.parseUrl('/'));
    })
  );
};
