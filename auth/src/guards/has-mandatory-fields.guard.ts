import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';
import { AuthenticationService } from '../authentication.service';
import { useNavigation } from '@vet/shared';

export const mandatoryFieldsGuard: CanActivateFn = () => {
  const auth = inject(AuthenticationService);
  const router = inject(Router);
  const navigationService = useNavigation();

  return toObservable(auth.isAuthenticated).pipe(
    filter((isAuth) => isAuth !== null && !auth.isLoadingUser()),
    take(1),
    map((isAuth) => {
      if (!isAuth) {
        return true;
      }

      const filled = auth.isMandatoryFieldsFilled();
      
      if (filled) {
        return true;
      }

      navigationService.setReturnUrl(router.url);
      return new RedirectCommand(router.createUrlTree(['/user-profile']));
    }),
  );
};