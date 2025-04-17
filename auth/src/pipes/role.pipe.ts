import { computed, inject, Pipe, PipeTransform } from '@angular/core';
import { AuthRole } from '../auth.types';
import { UserRolesService } from '@vet/auth';

@Pipe({
  name: 'role',
  pure: false,
  standalone: true,
})
export class RolePipe implements PipeTransform {
  private readonly userRolesService = inject(UserRolesService);

  transform(role: AuthRole): boolean {
    const value = computed(() => this.userRolesService.hasRole(role));

    return value();
  }
}
