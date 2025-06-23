import { inject } from '@angular/core';
import { AuthenticationService } from './authentication.service';

export function useUser() {
  const authService = inject(AuthenticationService);

  return authService.user;
}

export function useIsUserLoaded() {
  const authService = inject(AuthenticationService);

  return authService.isUserLoaded;
}
