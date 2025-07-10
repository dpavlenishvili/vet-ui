import { Pipe, PipeTransform } from '@angular/core';
import { AuthPermission } from '../auth.types';
import { useCan } from '../auth.signals';

@Pipe({
  name: 'can',
  pure: false,
  standalone: true,
})
export class CanPipe implements PipeTransform {
  private readonly can = useCan();

  transform(permission: AuthPermission): boolean {
    return this.can(permission)();
  }
}
