import { inject, Pipe, PipeTransform } from '@angular/core';
import { AuthRole } from '../auth.types';
import { UserRolesService } from '@vet/auth';

@Pipe({
  name: 'role',
  pure: true,
})
export class RolePipe implements PipeTransform {
  private readonly userRolesService = inject(UserRolesService);

  transform(role: AuthRole): boolean {
    return this.userRolesService.hasRole(role);
  }
}
