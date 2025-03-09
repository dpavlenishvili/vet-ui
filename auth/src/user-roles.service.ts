import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { RolesService } from '@vet/backend';
import { of } from 'rxjs';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

const SELECTED_USER_ROLE = '__selected_user_role__';

@Injectable({
  providedIn: 'root',
})
export class UserRolesService {
  readonly userRole = computed(() => {
    const userRole = this._userRole();
    const roles = this._userRoles.value();
    if (!roles) {
      return userRole;
    }
    const role = roles.find(({ name }) => name === userRole);
    if (role) {
      return role.name!;
    }
    const firstRole = roles[0]?.roles?.[0];
    return firstRole || 'Default User';
  });
  readonly roles = computed(() => this._userRoles.value() || []);
  private readonly _cookieService = inject(SsrCookieService);
  private readonly _userRole = signal(this._cookieService.get(SELECTED_USER_ROLE) || 'Default User');
  private readonly _authenticationService = inject(AuthenticationService);
  private readonly _rolesService = inject(RolesService);
  private readonly _userRoles = rxResource({
    request: () => this._authenticationService.isAuthenticated(),
    loader: ({ request: isAuthenticated }) => {
      if (isAuthenticated) {
        return this._rolesService.roles();
      }
      return of([]);
    },
  });
  constructor() {
    effect(() => {
      this._cookieService.set(SELECTED_USER_ROLE, this._userRole());
    });
  }
}
