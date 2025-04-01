import { inject, Pipe, PipeTransform } from '@angular/core';
import { AuthPermission } from '../auth.types';
import { UserRolesService } from '@vet/auth';

@Pipe({
  name: 'can',
  pure: true,
})
export class CanPipe implements PipeTransform {
  private readonly userRolesService = inject(UserRolesService);

  transform(permission: AuthPermission): boolean {
    return this.userRolesService.can(permission);
  }
}
