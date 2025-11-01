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

  return toObservable(auth.areCookiesLoaded).pipe(
    filter((loaded) => loaded),
    take(1),
    map(() => {
      if (auth.isMandatoryFieldsFilled()) {
        return true;
      }

      navigationService.setReturnUrl(router.url);

      return new RedirectCommand(router.createUrlTree(['/user-profile']));
    }),
  );
};
