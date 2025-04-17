import { computed, inject, Pipe, PipeTransform } from '@angular/core';
import { AuthPermission } from '../auth.types';
import { UserRolesService } from '@vet/auth';

@Pipe({
  name: 'can',
  pure: false,
  standalone: true,
})
export class CanPipe implements PipeTransform {
  private readonly userRolesService = inject(UserRolesService);

  transform(permission: AuthPermission): boolean {
    const value = computed(() => this.userRolesService.can(permission));

    return value();
  }
}
