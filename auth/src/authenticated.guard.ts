import {CanActivateFn, RedirectCommand, Router} from "@angular/router";
import {inject} from "@angular/core";
import {AuthenticationService} from "./authentication.service";

export const authenticatedGuard: CanActivateFn = () => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);
  if (authenticationService.isAuthenticated()) {
    return true;
  }
  return new RedirectCommand(
    router.parseUrl('/')
  );
}
