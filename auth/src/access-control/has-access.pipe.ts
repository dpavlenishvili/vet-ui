import { Pipe, PipeTransform } from '@angular/core';
import { useAccessControl } from './access-control.signal';
import { AccessControl } from '@vet/auth';

@Pipe({
  name: 'hasAccess',
  pure: false,
  standalone: true,
})
export class HasAccessPipe implements PipeTransform {
  private readonly hasAccess = useAccessControl();

  transform<T extends AccessControl>(control: T | null | undefined): boolean {
    return this.hasAccess(control)();
  }
}
