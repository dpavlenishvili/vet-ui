import { Pipe, PipeTransform } from '@angular/core';
import { AuthRole } from '../auth.types';
import { useHasRole } from '@vet/auth';

@Pipe({
  name: 'role',
  pure: false,
  standalone: true,
})
export class RolePipe implements PipeTransform {
  private readonly hasRole = useHasRole();

  transform(role: AuthRole): boolean {
    return this.hasRole(role)();
  }
}
